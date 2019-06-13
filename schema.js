const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");

//hard coded data

// const customers = [
//   { id: "1", name: "umer khan", email: "bla@gmail.com", age: 25 },
//   { id: "2", name: "abzan khan", email: "abzan@gmail.com", age: 26 },
//   { id: "3", name: "bant khan", email: "bant@gmail.com", age: 27 }
// ];

//customer query

const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
});
//root query

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        /*  for hardcoded data use
        for (let i = 0; i < customers.length; i++) {
          if (customers[i].id === args.id) {
            return customers[i];
          }
        } */

        //axios request to json server
        return axios
          .get("http://localhost:3000/customers/" + args.id)
          .then(res => res.data);
      }
    },
    //for the whole customers data
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/customers/")
          .then(res => res.data);
      }
    }
  }
});

//Mutation

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parentValue, args) {
        return axios
          .post("http://localhost:3000/customers", {
            name: args.name,
            email: args.email,
            age: args.age
          })
          .then(res => res.data);
      }
    },
    //delete mutation

    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        return axios
          .delete("http://localhost:3000/customers/" + args.id)
          .then(res => res.data);
      }
    },

    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parentValue, args) {
        return (
          axios
            // .patch("http://localhost:3000/customers/" + args.id,args) is similar as the below method
            .patch("http://localhost:3000/customers/" + args.id, {
              name: args.name,
              email: args.email,
              age: args.age
            })
            .then(res => res.data)
        );
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation
});
