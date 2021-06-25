const response = require('../lib/response')
const dynamodb = require('../lib/dynamodb')
const { v4: uuidv4 } = require('uuid')
const getPendingRequests = require('./getPendingRequests')
const getSandbox = require('../registry-api/getSandbox')

module.exports.handler = async (event) => {
    console.log('event:', event)
    if (!event.body) {
        console.log('no body')
        return response.create(400, { message: 'missing body' })
    }

    let data = JSON.parse(event.body)

    // Validate request
    const valid = await validate(data)
    if (valid === 1) {
        return response.create(400, { message: 'Bad Request' })
    } else if (valid === 2) {
        return response.create(400, {
            message: 'Request was already submitted',
        })
    } else if (valid === 3) {
        return response.create(400, {
            message: 'Sandbox does not exist',
        })
    } else if (valid === 4) {
        return response.create(500, {
            message: 'validation issue. See logs',
        })
    }

    // Create params for DynamoDB PUT request
    var params = {
        TableName: process.env.REQ_TABLE,
        Item: {
            // The attributes of the item to be created
            id: uuidv4(), // Hash Key (Primary Key)
            email: data.email,
            isAdmin: data.isAdmin,
            num: data.num,
            realm: data.realm,
            zone: data.zone,
            details: data.details,
            actioned: false,
            status: '',
        },
    }
    // console.log(params)
    // Attempt to create a Sandbox Request in DynamoDB
    try {
        const res = await dynamodb.put(params).promise()
        console.log('response: ', res)
        return response.create(res.statusCode, res)
    } catch (error) {
        console.log('error: ', error)
        return response.create(500, { error })
    }
}

// Validates if requests contains required attributes
const validate = async (data) => {
    console.log('DATA to validate: ', data)
    if (
        !data.email ||
        data.isAdmin === null || // isAdmin is a boolean so it must be checked like this
        data.isAdmin === undefined ||
        !data.details ||
        !data.num ||
        !data.realm ||
        !data.zone
    ) {
        return 1 // Returns 1 if required fields are missing
    }

    // Check if Sandbox in request exists in the sandbox database
    try {
        const sandbox = await getSandbox.handler({
            queryStringParameters: {
                num: data.num,
                realm: data.realm,
            },
        })
        if (sandbox.statusCode != 200) {
            return 3 // Returns 3 if sandbox does not exists
        }
    } catch (error) {
        console.log('Failed to getSandbox during validation', error)
        return 4 // Returns 4 due to back-end error
    }

    // Check if any pending request with same details already exists
    try {
        const SBRequest = await getPendingRequests.handler({
            // Using queryStringParameters so the exposed API can also be used in a similar manner if needed
            queryStringParameters: {
                num: data.num,
                realm: data.realm,
                email: data.email,
            },
        })
        if (
            SBRequest.statusCode == 200 &&
            JSON.parse(SBRequest.body)['Count'] > 0
        ) {
            return 2 // Returns 2 if request exists
        }
    } catch (error) {
        console.log('Failed to getPendingRequest during validation', error)
        return 4 // Returns 4 due to back-end error
    }
    return 0
}
