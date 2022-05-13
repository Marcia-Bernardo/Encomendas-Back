## MEAN STACK - Aplollo GraphQL

This documentation will contain the setup guide to set up a simple NodeJS backend with a graphql service.
We will be using the MEAN stack, backend being MongoDB and using Mongoose to do the ORM operations.


### Prerequisites

These are some of the technologies used:

 - [Apollo GraphQL](https://www.apollographql.com/docs/)
 - [Express.js](https://expressjs.com/en/starter/hello-world.html)
 - [MongoDB](https://www.mongodb.com/try/download/enterprise)
 - [Mongoose](https://mongoosejs.com/docs/guide.html)
 - [Postgres](https://www.postgresql.org)
 - [Json Web Token](https://www.npmjs.com/package/jsonwebtoken)

### Initialize the project

Run ``npm i`` to install the dependencies.

Create a .env file and populate it with the configs, follow the example:

```
MONGO_URI='mongodb://localhost:27017/test'
PORT=3000
PGHOST='localhost'
PGUSER='postgres'
PGDATABASE='xml'
PGPASSWORD='root'
PGPORT=5432
```

to run the server, run this command on your terminal:

```
npm run dev
```

and access the server at this uri https://localhost:3000 and  https://localhost:3000/graphql for the graqphql playground

#### GraphQL Schema

This file [schema.js](graphql/schema.js) contains the data definitions.
#### GraphQL Resolvers

This file [resolvers.js](graphql/resolvers.js) contains the business logic and CRUD functionality.











**Conclusion**

This is a simple REST API/GraphQL server that was built for a lab class and the main objective is to explore graphql and mongoDB. 