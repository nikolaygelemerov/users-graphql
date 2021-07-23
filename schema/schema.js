const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;
const axios = require('axios');

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      async resolve({ id }) {
        return (await axios.get(`http://localhost:3000/companies/${id}/users`))
          .data;
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve({ companyId }) {
        return axios
          .get(`http://localhost:3000/companies/${companyId}`)
          .then(response => response.data);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, args) {
        const response = await axios.get(
          `http://localhost:3000/users/${args.id}`
        );

        return response.data;
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      async resolve(_, args) {
        return (await axios.get(`http://localhost:3000/companies/${args.id}`))
          .data;
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      async resolve(_, { firstName, age }) {
        return (
          await axios.post('http://localhost:3000/users', {
            firstName,
            age
          })
        ).data;
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(_, { id }) {
        return (await axios.delete(`http://localhost:3000/users/${id}`)).data;
      }
    },
    /*
    mutation {
      deleteUser(id: "23") {
        id
      }
    }
    */
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      async resolve(_, args) {
        return (
          await axios.patch(`http://localhost:3000/users/${args.id}`, args)
        ).data;
      }
      /*
      mutation {
        editUser(id: "40", age: 10) {
          id
          firstName
          age
        }
      }
      */
    }
  }
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation });
