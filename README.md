<img src="https://raw.githubusercontent.com/eduardoboucas/haiku/master/logo.png" width="120">

# Haiku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Haiku is a small Node.js app that watches a branch on your GitHub repository and deploys every pull request to a new [Heroku](https://heroku.com) application. You will get a URL that represents a snapshot of the state of your project as per the contents of the pull request, useful to test or to share features with colleagues/clients before rolling out to production.

## How it works

1. When a new pull request is created, a new Heroku app is created programatically and it's built using the state of the branch being merged

1. The URL of the app will be added to the pull request once it finishes building

1. Every new commit to the branch while the pull request is open will rebuild the app

1. When the pull request is merged or closed the app will be destroyed

## Pre-requisites

Before getting started, you'll need:

- A [Heroku](https://www.heroku.com) account
- A Heroku API key, which you can get by going to the [Account settings](https://dashboard.heroku.com/account) page
- A GitHub account and a [personal access token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)

## Installation

1. Clone this repository and install the dependencies

  ```
  git clone https://github.com/eduardoboucas/haiku.git
  cd haiku
  npm install
  ```

1. Edit the [configuration](#configuration) parameters

1. Add a webhook to the GitHub repository by going to its *Settings* page and going to *Webhooks* > *Add webhook*.
  - **Payload URL**: The URL where Haiku will live
  - **Content type**: `application/json`
  - **Secret**: The secret you added to the configuration
  - Select *Let me select individual events.* and choose only **pull_request**
  
1. Start the app

  ```
  npm start
  ```
  
## Configuration

Configuration parameters can be set using either a JSON config file, named `config.{ENVIRONMENT}.json` (where `{ENVIRONMENT}` is replaced by the environment running the app), or by environment variables.


| Config file property | Environment variable    | Description                              | Default       |
|----------------------|-------------------------|------------------------------------------|---------------|
| `env`                | `NODE_ENV`              | The application environment              | `development` |
| `port`               | `PORT`                  | The port to bind the application to      | —             |
| `githubApiToken`     | `GITHUB_API_TOKEN`      | Access token to the GitHub API           | —             |
| `herokuApiToken`     | `HEROKU_API_TOKEN`      | Access token to the Heroku Platform API  | —             |
| `webhookEndpoint`    | `WEBHOOK_ENDPOINT`      | Endpoint used to handle webhook requests | `/webhook`    |
| `webhookSecret`      | `GITHUB_WEBHOOK_SECRET` | Secret to decode webhook requests with   | —             |
| `pullRequest.branch` | `PR_BRANCH`             | Name of the branch to watch for PRs      | master        |
| `buildpack`          | `BUILDPACK_URL`         | URL of the Heroku buildpack to use       | —             |

## Colophon

A traditional Japanese [haiku](https://en.wikipedia.org/wiki/Haiku) is a three-line poem with seventeen syllables, written in a 5/7/5 syllable count. It is also in [the origin](https://twitter.com/heroku/status/11845430164) of the name Heroku.
The logo was designed by Claudio Gomboli of [The Noun Project](https://thenounproject.com/clagom).

## License

Copyright 2017 Eduardo Bouças

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
