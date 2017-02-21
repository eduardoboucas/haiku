<img src="https://cloud.githubusercontent.com/assets/4162329/23179689/ad201094-f866-11e6-9682-f2401f70f05f.png" width="120">

# Haiku

> *Instant Heroku deploys from GitHub branches*

Haiku is a small Node.js app that watches a branch on your GitHub repository and deploys every new pull request to a [Heroku](https://heroku.com) application. The resulting URL will give you a snapshot of your project as per the contents of the pull request, which you can use to test or to share with colleagues/clients before rolling out to production.

## How it works

1. When a new pull request is created to the branch being watched, a new Heroku app is created programatically and it's built using the state of the branch being merged

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
