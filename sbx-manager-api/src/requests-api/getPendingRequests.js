const response = require('../lib/response')
const dynamodb = require('../lib/dynamodb')

module.exports.handler = async (event) => {
    console.log('event:', event)

    var params = {
        TableName: process.env.REQ_TABLE,
        ExpressionAttributeValues: { ':a': false },
        FilterExpression: 'actioned = :a',
    }

    try {
        if (event.queryStringParameters) {
            if (!event.queryStringParameters.zone) {
                const { num, realm, email } = event.queryStringParameters
                params.FilterExpression +=
                    ' and email = :email and num = :num and realm = :realm'
                params.ExpressionAttributeValues[':email'] = email
                    .trim()
                    .toLowerCase()
                params.ExpressionAttributeValues[':realm'] = realm
                    .trim()
                    .toLowerCase()
                params.ExpressionAttributeValues[':num'] = parseInt(num)
            } else {
                const zone = event.queryStringParameters.zone
                params.ExpressionAttributeNames = {
                    '#Z': 'zone',
                }
                params.FilterExpression += ' and #Z = :zone'
                params.ExpressionAttributeValues[':zone'] = zone
            }
        }
        // console.log(params.FilterExpression)
        // console.log(params.ExpressionAttributeValues)
        const res = await dynamodb.scan(params).promise()
        console.log('response: ', res)
        return response.create(200, res)
    } catch (error) {
        console.log('error: ', error)
        return response.create(500, { error: error.message })
    }
}
