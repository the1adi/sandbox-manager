const axios = require('axios')

// PUT call to update user's roleTenantFilter
module.exports.handler = async (params) => {
    var config = {
        method: 'put',
        url: process.env.AM_URL + '/rest/v1/users/' + params.id,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + params.token,
            // Cookie:
            //     'NGINX_SESSION=1615673586.098.133.218153; XSRF-TOKEN=91259f36-4bca-429c-8755-6c7d4c0cd8bc',
        },
        data: {
            mail: params.mail,
            firstName: params.firstName,
            lastName: params.lastName,
            displayName: params.displayName,
            roles: ['bm-admin', 'bm-user'],
            organizations: ['L’Oreal'],
            primaryOrganization: params.primaryOrganization,
            roleTenantFilter: params.roleTenantFilter,
            userState: 'ENABLED',
            id: params.id,
        },
    }
    console.log('UPDATE ACCOUNT MANAGER PARAMS: ', config)
    try {
        const res = await axios(config)
        console.log(res)
        if (res.status != 200) {
            throw new Error(res)
        }
        console.log('ACCOUNT MANAGER ALLOCATION RESPONSE.....')
        return res.data
    } catch (error) {
        return { error: error.message }
    }
}
