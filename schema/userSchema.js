import graphql, { GraphQLObjectType, GraphQLString } from "graphql";

export const UserSchemaType = new GraphQLObjectType({
  name: "UserDetails",
  description: "Get user information",
  fields: () => ({
    userID: { type: GraphQLString },
  }),
});



