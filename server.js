const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');
const app = express();
const PORT = 4000;

app.use('/graphql', expressGraphQL({ schema, graphiql: true }));

app.listen(PORT, () => {
  console.log(`app listening on port: ${PORT}`);
});
