import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

export const CollectionSchemaType = new GraphQLObjectType({
  name: "collectionData",
  description: "represent collection data",

  fields: () => ({
    collectionName: { type: GraphQLString },
    floorPrice: { type: GraphQLInt },
    totalItem: { type: GraphQLInt },
    nftList: { type: new GraphQLList(NFTSchemaType) },
  }),
});

export const NFTSchemaType = new GraphQLObjectType({
  name: "NFTSchema",
  description: "NFT data ",
  fields: () => ({
    nftName: { type: GraphQLString },
    nftImage: { type: GraphQLString },
  }),
});
