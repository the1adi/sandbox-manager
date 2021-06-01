const response = require('../lib/response')
const dynamodb = require('../lib/dynamodb')
const { validate: uuidValidate } = require('uuid')

module.exports.handler = async (event) => {
    console.log('event:', event)
    if (
        !event.queryStringParameters ||
        !event.queryStringParameters.realm ||
        !event.queryStringParameters.num
    ) {
        return response.create(400, {
            message: 'missing queryStringParameters',
        })
    }

    let realm = event.queryStringParameters.realm
    let num = parseInt(event.queryStringParameters.num)

    var params = {
        TableName: process.env.REG_TABLE,
        Key: {
            realm: realm,
            num: num,
        },
    }

    try {
        const res = await dynamodb.get(params).promise()
        console.log('response: ', res)
        if (!res.Item) {
            // console.log('NO ITEM FOUND.. THROW ERROR')
            return response.create(404, { error: 'Sandbox not found.' })
        }
        return response.create(200, res)
    } catch (error) {
        console.log('error: ', error)
        return response.create(500, { error: error.message })
    }
}
