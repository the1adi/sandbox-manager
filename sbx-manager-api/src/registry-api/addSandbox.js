const response = require('../lib/response')
const dynamodb = require('../lib/dynamodb')
const getSandbox = require('../registry-api/getSandbox')

module.exports.handler = async (event) => {
    console.log('event:', event)
    if (!event.body) {
        console.log('no body')
        return response.create(400, { message: 'missing body' })
    }

    // parse body
    let data = JSON.parse(event.body)

    // validate if requests contain required attributes or if already created
    const valid = await validate(data)
    if (valid === 1) {
        return response.create(400, { message: 'Bad Request' })
    } else if (valid === 3) {
        return response.create(400, {
            message: 'Sandbox already exists. Re-creating the Sandbox will overwite the data for the Item',
        })
    } else if (valid === 4) {
        return response.create(500, {
            message: 'Validation issue. Failed to getSandbox during validation',
        })
    }

    var params = {
        TableName: process.env.REG_TABLE,
        Item: {
            // The attributes of the item to be created
            realm: data.realm.trim().toLowerCase(), // Hash Key (Partition Key)
            num: parseInt(data.num), // Range Key (Sort Key)
            zone: data.zone,
            admins: [],
            users: [],
            url: data.url,
            isAllocated: false,
            allocationDetails: null,
        },
    }
    // console.log(params)

    try {
        const res = await dynamodb.put(params).promise()
        console.log('response: ', res)
        return response.create(res.statusCode, res)
    } catch (error) {
        console.log('error: ', error)
        return response.create(500, { error })
    }
}

// Validates if requests contain required attributes
const validate = async (data) => {
    if (!data.num || !data.realm || !data.zone || !data.url) {
        return 1
    }
    // Check if Sandbox exists in the sandbox database
    try {
        const sandbox = await getSandbox.handler({
            queryStringParameters: {
                num: data.num,
                realm: data.realm,
            },
        })
        console.log( "GET SANDBOX Status Code:", sandbox.statusCode)
        if (sandbox.statusCode == 200) {
            return 3 // Returns 3 if sandbox DOES exists
        }
    } catch (error) {
        console.log('Failed to getSandbox during validation', error)
        return 4 // Returns 4 due to back-end error
    }
    return 0
}
