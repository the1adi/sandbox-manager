const dynamodb = require('../lib/dynamodb')
const helpers = require('../lib/helpers')
const getToken = require('../account-manager-api/getToken')
const getUser = require('../account-manager-api/getUser')
const updateUser = require('../account-manager-api/updateUser')

module.exports.handler = async (event) => {
    console.log('ALLOCATING SANDBOX NOW')
    console.log('event:', event)
    if (!event.details || !event.key || !event.email) {
        return {
            error: 'missing params in function call',
        }
    }

    // Calls to Account Manager
    try {
        // Get Account Manager Token
        const token = await getToken.handler()
        console.log('TOKEN: ', token)
        if (token.error) {
            throw new Error(token.error)
        }

        // Get User's details
        const user = await getUser.handler({
            email: event.email,
            token: token.access_token,
        })
        console.log('USER: ', user)
        if (user.error) {
            // Throw error if user does not exist in Account Manager
            throw new Error(user.error)
        }
        // Update User's RoleTenantFilter
        const roleTenantFilter = await helpers.getNewRoleTenantFilter({
            action: "allocate",
            isAdmin: event.isAdmin,
            roleTenantFilter: user.roleTenantFilter,
            realm: event.key.realm,
            num: event.key.num,
        })

        // Update Call to Account Manager
        var paramsData = {
            id: user.id,
            token: token.access_token,
            mail: user.mail,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            primaryOrganization: user.primaryOrganization,
            roleTenantFilter: roleTenantFilter,
        }
        const res = await updateUser.handler(paramsData)
        console.log(res)
    } catch (error) {
        console.log('error: ', error)
        return { error: error.message }
    }

    // Update Sandbox Details in SB Registry DB
    var params
    if (event.isAdmin) {
        params = {
            TableName: process.env.REG_TABLE,
            Key: {
                realm: event.key.realm,
                num: event.key.num,
            },
            // 'UpdateExpression' defines the attributes to be updated
            // 'ExpressionAttributeValues' defines the value in the update expression
            ExpressionAttributeNames: {
                '#A': 'allocationDetails',
                '#U': 'admins',
            },
            UpdateExpression:
                'SET isAllocated = :isAllocated, #A = :allocationDetails, #U = list_append(#U, :adminEmailArr)', // Working now
            ConditionExpression: 'not contains (#U, :adminEmail)',
            ExpressionAttributeValues: {
                ':isAllocated': true,
                ':allocationDetails': event.details,
                ':adminEmailArr': [event.email],
                ':adminEmail': event.email,
            },
            // 'ReturnValues' specifies if and how to return the item's attributes,
            // where ALL_NEW returns all attributes of the item after the update; you
            // can inspect 'result' below to see how it works with different settings
            ReturnValues: 'ALL_NEW',
        }
    }
    else {
        params = {
            TableName: process.env.REG_TABLE,
            Key: {
                realm: event.key.realm,
                num: event.key.num,
            },
            // 'UpdateExpression' defines the attributes to be updated
            // 'ExpressionAttributeValues' defines the value in the update expression
            ExpressionAttributeNames: {
                '#A': 'allocationDetails',
                '#U': 'users',
            },
            UpdateExpression:
                'SET isAllocated = :isAllocated, #A = :allocationDetails, #U = list_append(#U, :userEmailArr)', // Working now
            ConditionExpression: 'not contains (#U, :userEmail)',
            ExpressionAttributeValues: {
                ':isAllocated': true,
                ':allocationDetails': event.details,
                ':userEmailArr': [event.email],
                ':userEmail': event.email,
            },
            // 'ReturnValues' specifies if and how to return the item's attributes,
            // where ALL_NEW returns all attributes of the item after the update; you
            // can inspect 'result' below to see how it works with different settings
            ReturnValues: 'ALL_NEW',
        }
    }

    try {
        const res = await dynamodb.update(params).promise()
        console.log('response: ', res)
        return { message: 'Success' }
    } catch (error) {
        console.log('error: ', error)
        return { error: error.message }
    }
}
