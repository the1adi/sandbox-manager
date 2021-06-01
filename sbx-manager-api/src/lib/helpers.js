const REALM_MAPPING = {
    lora: 'aang',
    latam: 'aatl',
    canada: 'aafm',
}

// Creates a new roleTenantFilter
module.exports.getNewRoleTenantFilter = async (params) => {
    let roleTenantFilter = params.roleTenantFilter != '' ? params.roleTenantFilter : 'ECOM_ADMIN:'
    let realm = params.realm
    let num = params.num
    if (params.action == 'allocate') {
        if (params.isAdmin) {
            var filteredTenantArr = roleTenantFilter.split('ECOM_ADMIN:')
            var filteredTenant =
                filteredTenantArr[0] +
                'ECOM_ADMIN:' +
                REALM_MAPPING[realm] +
                '_s' +
                num +
                ',' +
                filteredTenantArr[1]
            return filteredTenant
        } else {
            var filteredTenantArr = roleTenantFilter.split('ECOM_USER:')
            var filteredTenant =
                filteredTenantArr[0] +
                'ECOM_USER:' +
                REALM_MAPPING[realm] +
                '_s' +
                num +
                ',' +
                filteredTenantArr[1]
            return filteredTenant
        }
    } else {
        // TODO DE-ALLOCATE SANDBOX
    }
}

