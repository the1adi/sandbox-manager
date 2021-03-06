const response = require('../lib/response')
const dynamodb = require('../lib/dynamodb')

module.exports.handler = async (event) => {
    console.log('event:', event)

    var params = {
        TableName: process.env.REQ_TABLE,
    }

    try {
        const res = await dynamodb.scan(params).promise()
        console.log('response: ', res)
        return response.create(200, res)
    } catch (error) {
        console.log('error: ', error)
        return response.create(500, { error: error.message })
    }
}
