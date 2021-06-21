const response = require('../lib/response')
const dynamodb = require('../lib/dynamodb')
const { validate: uuidValidate } = require('uuid')

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

    var params = {
        TableName: process.env.REQ_TABLE,
        Key: {
            id: id,
        },
    }

    try {
        const res = await dynamodb.get(params).promise()
        console.log('DB response: ', res)
        if (!res.Item) {
            // console.log('NO ITEM FOUND.. THROW ERROR')
            return response.create(404, { error: 'SB request not found.' })
        }
        return response.create(200, res)
    } catch (error) {
        console.log('error: ', error)
        return response.create(500, { error: error.message })
    }
}
