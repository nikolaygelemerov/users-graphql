const express = require('express');
const expressGraphQL = require('express-graphql');

const app = express();
const PORT = 3000;

app.use('/graphql', expressGraphQL({ graphiql: true }));

app.listen(PORT, () => {
  console.log(`app listening on port: ${PORT}`);
});
