const response = require('../lib/response')
const dynamodb = require('../lib/dynamodb')
const { validate: uuidValidate } = require('uuid')
const getSandboxRequest = require('./getSandboxRequest')

module.exports.handler = async (event) => {
    console.log('event:', event)
    if (!event.pathParameters || !event.pathParameters.id) {
        return response.create(400, { message: 'missing ID name from path' })
    }

    let id = event.pathParameters.id
    // Validate if id passed is a valid UUID
    if (!uuidValidate(id)) {
        return response.create(400, { message: 'Bad Request' })
    }

    // Check to see if SB ID exists
    try {
        const SBRequest = await getSandboxRequest.handler({
            pathParameters: { id },
        })
        console.log(SBRequest)
        if (SBRequest.statusCode != 200) {
            // console.log('NO ITEM FOUND.. THROW ERROR')
            throw new Error('Item not found.')
        }
    } catch (error) {
        // console.log(error)
        return response.create(500, { error: error.message })
    }

    // Decline request in DB
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
            ':status': 'declined',
        },
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where ALL_NEW returns all attributes of the item after the update; you
        // can inspect 'result' below to see how it works with different settings
        ReturnValues: 'ALL_NEW',
    }

    try {
        const res = await dynamodb.update(params).promise()
        console.log('response: ', res)
        // if (!res.Item) {
        //     // console.log('NO ITEM FOUND.. THROW ERROR')
        //     throw new Error('Item not found.')
        // }
        return response.create(200, res)
    } catch (error) {
        console.log('error: ', error)
        return response.create(500, { error: error.message })
    }
}
