const response = require('../lib/response')
const dynamodb = require('../lib/dynamodb')
const { validate: uuidValidate } = require('uuid')
const getSandboxRequest = require('./getSandboxRequest')
const allocateSandbox = require('../registry-api/allocateSandbox')

// Approves Sandbox Request. 'event' contains the ID of the request in the path parameters
module.exports.handler = async (event) => {
    console.log('event:', event)
    if (!event.pathParameters || !event.pathParameters.id) {
        return response.create(400, { message: 'missing ID name from path' })
    }

    let id = event.pathParameters.id
    // Validate if id passed is a valid UUID
    if (!uuidValidate(id)) {
        return response.create(400, { message: 'Bad Request.. Not a Valid UUID' })
    }

    // Check to see if SB request ID exists
    var SBRequest
    try {
        const res = await getSandboxRequest.handler({
            pathParameters: { id },
        })
        console.log(res)
        if (res.statusCode != 200) {
            // console.log('NO ITEM FOUND.. THROW ERROR')
            throw new Error('Item not found.')
        }
        SBRequest = JSON.parse(res.body)
        if (SBRequest.Item.actioned) {
            throw new Error('Request has been actioned.')
        }
    } catch (error) {
        // console.log(error)
        return response.create(400, { error: error.message })
    }

    // Call allocateSandbox - accept fieldName to update as a param
    try {
        const res = await allocateSandbox.handler({
            key: {
                realm: SBRequest.Item.realm,
                num: SBRequest.Item.num,
            },
            details: SBRequest.Item.details,
            isAdmin: SBRequest.Item.isAdmin,
            email: SBRequest.Item.email
        })
        if (res.error) {
            throw new Error(res.error)
        }
        console.log(res.message)
    } catch (error) {
        // console.log(error)
        return response.create(500, { error: error.message })
    }

    // Approve Request in SB Requests DB
    var params = {
        TableName: process.env.REQ_TABLE,
        Key: {
            id: id,
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        ExpressionAttributeNames: {
            '#S': 'status',
        },
        UpdateExpression: 'SET actioned = :actioned, #S = :status',
        ExpressionAttributeValues: {
            ':actioned': true,
            ':status': 'approved',
        },
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where ALL_NEW returns all attributes of the item after the update; you
        // can inspect 'result' below to see how it works with different settings
        ReturnValues: 'ALL_NEW',
    }

    try {
        const res = await dynamodb.update(params).promise()
        console.log('response: ', res)
        return response.create(200, res)
    } catch (error) {
        console.log('error: ', error)
        return response.create(500, { error: error.message })
    }
}
