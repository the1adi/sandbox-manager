var client_id = ''
var password = ''

const token = Buffer.from(`${client_id}:${password}`, 'utf8').toString('base64')

module.exports.b64_AM = token