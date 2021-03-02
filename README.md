# Local dev environment setup

## Installation

npm install

## Setup
### Run this once before futher actions

grunt build

## Development
### Watch

grunt

or

grunt watch

### Start server (local)

npm run start_local

### Start sever (production)

pm2 startOrGracefulReload ecosystem.json --only app-production
