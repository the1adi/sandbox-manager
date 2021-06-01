'use strict'

const AWS = require('aws-sdk') // eslint-disable-line import/no-extraneous-dependencies

// connect to local DB if running offline
let options = { region: 'localhost', endpoint: 'http://localhost:8000' }

const client = process.env.IS_OFFLINE
    ? new AWS.DynamoDB.DocumentClient(options)
    : AWS.DynamoDB.DocumentClient()

module.exports = client
