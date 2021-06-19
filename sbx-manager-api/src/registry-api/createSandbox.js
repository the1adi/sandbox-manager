const response = require('../lib/response')
const dynamodb = require('../lib/dynamodb')

module.exports.handler = async (event) => {
    console.log('event:', event)
    if (!event.body) {
        console.log('no body')
        return response.create(400, { message: 'missing body' })
    }

    let data = JSON.parse(event.body)
    if (!validate(data)) {
        return response.create(400, { message: 'Bad Request' })
    }

    var params = {
        TableName: process.env.REG_TABLE,
        Item: {
            // The attributes of the item to be created
            realm: data.realm.trim().toLowerCase(), // Hash Key (Partition Key)
            num: data.num, // Range Key (Sort Key)
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

// Validates if requests contains required attributes
const validate = (data) => {
    if (!data.num || !data.realm || !data.zone || !data.url) {
        return false
    }
    return true
}
