const axios = require('axios')

// Gets User details from Account Manager 
module.exports.handler = async (params) => {
    var config = {
        method: 'get',
        url:
            process.env.AM_URL +
            '/rest/v1/users/search/findByLogin/?login=' + params.email,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + params.token,
            // Cookie:
            //     'NGINX_SESSION=1615673586.098.133.218153; XSRF-TOKEN=91259f36-4bca-429c-8755-6c7d4c0cd8bc',
        },
    }

    try {
        const res = await axios(config)
        return res.data
    } catch (error) {
        return { error: error.message }
    }
}
