const axios = require('axios')
const qs = require('qs')
const am_config = require('./am_config')

// Gets Token from Account Manager
module.exports.handler = async () => {
    var token = am_config.b64_AM
    var config = {
        method: 'post',
        url: process.env.AM_URL + '/oauth2/access_token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${token}`,
        },
        data: qs.stringify({ grant_type: 'client_credentials' }),
    }

    try {
        const res = await axios(config)
        return res.data
    } catch (error) {
        return { error: error.message }
    }
}
