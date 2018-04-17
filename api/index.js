var express = require('express');
var graphqlHTTP = require('express-graphql');
const {
  schema,
  global
} = require('./src/schema.js');
const PORT = process.env.PORT || 5000

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: global,
  graphiql: true,
}));

app.listen(PORT);
console.log('Running a GraphQL API server at localhost:5000/graphql');
