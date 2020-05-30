# Live Traffic Cam feeds

Updates every minute

## Setup

Install node dependencies
```
npm install
```

Create Secrets
```
python secrets.py
```

## Start Server

Compile typescript server code to javascript
```
tsc
```

Run server
```
node server/main.js
```

## Deploy
```
python deploy.py
```
Outputs a deploy.zip for uploading to cloud.