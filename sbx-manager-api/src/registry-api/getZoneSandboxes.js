const response = require('../lib/response')
const dynamodb = require('../lib/dynamodb')

module.exports.handler = async (event) => {
    console.log('event:', event)
    if (!event.pathParameters || !event.pathParameters.zone) {
        return response.create(400, {
            message: 'missing pathParameters',
        })
    }
    let zone = event.pathParameters.zone

    var params = {
        ExpressionAttributeNames: {
            '#Z': 'zone',
        },
        TableName: process.env.REG_TABLE,
        ExpressionAttributeValues: { ':a': zone },
        FilterExpression: '#Z = :a', // Zone is a reserved Key word... need to change
    }

    try {
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
