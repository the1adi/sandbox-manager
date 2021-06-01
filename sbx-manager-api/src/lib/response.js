module.exports.create = (status, data) => ({
    statusCode: status,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(data),
})
