module.exports.create = (status, data) => ({
    statusCode: status,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(data),
})
