'use strict'

const convict = require('convict')

const schema = {
  env: {
    doc: 'The applicaton environment',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind the application to',
    format: 'port',
    default: 0,
    env: 'PORT'
  },
  githubApiToken: {
    doc: 'Access token to the GitHub API',
    format: String,
    default: null,
    env: 'GITHUB_API_TOKEN'
  },
  herokuApiToken: {
    doc: 'Access token to the Heroku Platform API',
    format: String,
    default: null,
    env: 'HEROKU_API_TOKEN'
  },
  webhookEndpoint: {
    doc: 'Endpoint used to handle webhook requests',
    format: String,
    default: '/webhook'
  },
  webhookSecret: {
    doc: 'Secret to decode webhook requests with',
    format: String,
    default: '',
    env: 'GITHUB_WEBHOOK_SECRET'
  },
  pullRequest: {
    branch: {
      doc: 'Name of the branch to watch for PRs',
      format: String,
      default: 'master'
    }
  },
  buildpack: {
    doc: 'URL of the Heroku buildpack to use',
    format: String,
    default: null
  }
}

let config = convict(schema)

try {
  let configFilePath = `${__dirname}/config.${config.get('env')}.json`

  config.loadFile(configFilePath)
  config.validate()

  console.log(`Loaded config from local file (${configFilePath})`)
} catch (err) {}

module.exports = config
module.exports.schema = schema
