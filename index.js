'use strict'

const config = require('./config')
const Haiku = require('./lib/Haiku')
const http = require('http')
const webhookHandler = require('github-webhook-handler')({
  path: config.get('webhookEndpoint'),
  secret: config.get('webhookSecret')
})

http.createServer((req, res) => {
  webhookHandler(req, res, (err) => {
    res.statusCode = 404

    res.end('Unknown endpoint')
  })
}).listen(config.get('port'), () => {
  console.log(`Server listening on port ${config.get('port')}`)
})

webhookHandler.on('pull_request', (data) => {
  const branch = data.payload.pull_request.base.ref
  const headSha = data.payload.pull_request.head.sha

  if (branch !== config.get('pullRequest.branch')) return

  let haiku = new Haiku({
    buildpackUrl: config.get('buildpack'),
    githubUsername: data.payload.repository.owner.login,
    githubRepository: data.payload.repository.name,
    githubApiToken: config.get('githubApiToken'),
    herokuApiToken: config.get('herokuApiToken')
  })

  switch (data.payload.action) {
    // PR created
    case 'opened':
      haiku.createApp().then(app => {
        return haiku.buildAndUpdateStatus(headSha)
      })

      break

    // PR updated  
    case 'synchronize':
      let previousSha = data.payload.before

      return haiku.loadApp(previousSha).then(app => {
        return haiku.buildAndUpdateStatus(headSha)
      })

      break

    // PR closed
    case 'closed':
      return haiku.loadApp(headSha).then(app => {
        return haiku.deleteApp()
      })

      break
  }
})

webhookHandler.on('error', (err) => {
  console.error('Error:', err.message)
})
