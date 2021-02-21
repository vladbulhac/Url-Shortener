# Backend
## Requirements
Add a .env file in the Backend folder with the following fields that must be filled in with values that correspond with the type in parentheses:

```
NODE_ENV=development
PORT= (number)
CACHE_ENTRY_TTL_SECONDS= (number)
CACHE_PERIODIC_UPDATE_MINUTES= (number)
JWT_SECRET= (string)
JWT_DURATION_SECONDS= (number)
URL_TTLINCREASE_EXTENDED_DAYS= (number)
URL_TTLINCREASE_DAYS= (number)
DB_URLDISABLE_SCHEDULECRON= (*)
MONGO_USER= (string)
MONGO_PASSWORD= (string)
MONGO_PATH=@(*****)/test?retryWrites=true&w=majority
URL_CONVERSIONCHARACTERS= (string)

For (*) Use the syntax described here -> https://www.npmjs.com/package/node-cron
For (*****) Use the cluster name provided by MongoDB -> https://docs.atlas.mongodb.com/tutorial/create-new-cluster
```

## Run
`npm run dev`
## Test
`npm run test`
