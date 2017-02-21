'use strict'

const GitHubAPI = require('github')
const Heroku = require('heroku-client')

const Haiku = function (options) {
  this.CONTEXT = 'HaikuCI'

  this.buildpackUrl = options.buildpackUrl

  // GitHub repository information
  this.githubRepository = options.githubRepository
  this.githubUsername = options.githubUsername

  // Instance of Heroku API
  this.herokuApi = new Heroku({
    token: options.herokuApiToken
  })

  // Instance of GitHub API
  this.githubApi = new GitHubAPI({
    debug: true,
    protocol: 'https',
    headers: {
      'user-agent': 'Haiku'
    },
    followRedirects: false,
    Promise: Promise,
    timeout: 5000
  })

  this.githubApi.authenticate({
    type: 'oauth',
    token: options.githubApiToken
  })
}

Haiku.prototype._getTarballURL = function (sha) {
  return  this.githubApi.repos.getArchiveLink({
    owner: this.githubUsername,
    repo: this.githubRepository,
    archive_format: 'tarball',
    ref: sha
  }).then(data => {
    return data.meta.location
  })
}

Haiku.prototype._pollBuildStatus = function (callback) {
  if (!this.buildId) return

  let buildPoll = setInterval(() => {
    this.herokuApi.get(`/apps/${this.appName}/builds/${this.buildId}`).then(build => {
      if ((build.status === 'succeeded') || (build.status === 'failed')) {
        clearInterval(buildPoll)
        
        callback(build)  
      }
    })
  }, 2000)  
}

Haiku.prototype._setCommitStatus = function (sha, status, description) {
  let payload = {
    owner: this.githubUsername,
    repo: this.githubRepository,
    sha: sha,
    state: status,
    description: description,
    context: this.CONTEXT
  }

  if (this.appUrl) {
    payload.target_url = this.appUrl
  }

  return this.githubApi.repos.createStatus(payload)
}

Haiku.prototype.createApp = function () {
  return this.herokuApi.post('/apps').then(app => {
    this.appName = app.name
    this.appUrl = app.web_url

    return {
      appName: app.name,
      appUrl: app.web_url
    }
  })
}

Haiku.prototype.build = function (sha, callback) {
  if (!this.buildpackUrl || !this.buildpackUrl.length) {
    throw Error('No buildpack URL has been defined')
  }

  // Set commit status
  this._setCommitStatus(sha, 'pending', 'Your Heroku site is being built...')

  return this._getTarballURL(sha).then(url => {
    let payload = {
      'buildpacks': [
        {
          'url': this.buildpackUrl
        }
      ],
      'source_blob': {
        'url': url,
        'version': sha
      }
    }

    return this.herokuApi.post(`/apps/${this.appName}/builds`, {body: payload}).then(build => {
      this.buildId = build.id

      // Poll build status
      this._pollBuildStatus(callback)

      return {
        buildId: build.id
      }
    })
  })
}

Haiku.prototype.buildAndUpdateStatus = function (sha) {
  return this.build(sha, (build) => {
    if (build.status === 'succeeded') {
      this._setCommitStatus(sha, 'success', 'Your Heroku site has been built.')
    } else {
      this._setCommitStatus(sha, 'failure', 'Your Heroku site has failed to build.')
    }
  })
}

Haiku.prototype.deleteApp = function () {
  return this.herokuApi.delete(`/apps/${this.appName}`)
}

Haiku.prototype.loadApp = function (sha) {
  return this.githubApi.repos.getStatuses({
    owner: this.githubUsername,
    repo: this.githubRepository,
    ref: sha
  }).then(response => {
    return new Promise((resolve, reject) => {
      let status = response.data.find(status => {
        return status.context === this.CONTEXT
      })

      if (!status) {
        return reject()
      }

      return resolve(status.target_url)
    })
  }).then(url => {
    let appName = url.match(/http(s?):\/\/(.*?)\.herokuapp\.com/)[2]

    this.appName = appName
    this.appUrl = url

    return {
      appName: appName,
      appUrl: url
    }
  })
}

module.exports = Haiku
