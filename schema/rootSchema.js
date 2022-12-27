import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { UserSchemaType } from "./userSchema.js";
import { isMetadata, Metaplex } from "@metaplex-foundation/js";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import axios from "axios";
import "isomorphic-fetch";
import { MongoClient } from "mongodb";
import { CollectionSchemaType } from "./collectionSchema.js";

export const rootQuery = new GraphQLObjectType({
  name: "rootQuery",
  description: "root query to get all other queries",
  fields: () => ({
    getUserInfo: {
      type: new GraphQLList(CollectionSchemaType),
      args: { walletAddress: { type: GraphQLString } },

      async resolve(parent, args) {
        const connection = new Connection(
          "https://solana-devnet.g.alchemy.com/v2/SmTLHznGV1gnnP1F-hvPsTjOeVNAABTG"
        );
        const metaplex = new Metaplex(connection);

        const ownedNFTs = await metaplex
          .nfts()
          .findAllByOwner({ owner: new PublicKey(args.walletAddress) });

        let promisesList = [];

        ownedNFTs.forEach((item) => {
          promisesList.push(fetch(item.uri));
        });

        const filteredData = {};

        let promiseData = await Promise.all(promisesList).then((results) =>
          Promise.all(results.map((r) => r.json()))
        );

        promiseData.forEach((item) => {
          if (item.collection === undefined) {
            if (filteredData[`unnamed`]) {
              filteredData[`unnamed`].push({
                nftName: item.name,
                nftImage: item.image,
              });
            } else {
              filteredData[`unnamed`] = [
                {
                  nftName: item.name,
                  nftImage: item.image,
                },
              ];
            }
          } else {
            if (filteredData[`${item.collection.name}`]) {
              filteredData[`${item.collection.name}`].push({
                nftName: item.name,
                nftImage: item.image,
              });
            } else {
              filteredData[`${item.collection.name}`] = [
                {
                  nftName: item.name,
                  nftImage: item.image,
                },
              ];
            }
          }
        });

        let finalData = [];

        console.log(Object.keys(filteredData));

        Object.keys(filteredData).forEach((item) => {
          finalData.push({
            collectionName: item,
            floorPrice: 0,
            totalItem: filteredData[`${item}`].length,
            nftList: filteredData[`${item}`],
          });
        });

        return finalData;
      },
    },
  }),
});

export const rootMutation = new GraphQLObjectType({
  name: "rootMutationQuery",
  description: "root mutation query",
  fields: {
    verifyCollection: {
      type: GraphQLString,
      args: {
        updateAuthority: { type: GraphQLString },
        collectionName: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const client = new MongoClient(process.env.DATABASE_URI);
        const marketplaceDB = client.db("marketlplaceDB");
        const verfiedCollection = marketplaceDB.collection(
          "verifiedCollections"
        );

        const filter = {
          updateAuthority: args.updateAuthority,
        };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            updateAuthority: args.updateAuthority,
            collectionName: args.collectionName,
          },
        };
        const result = await verfiedCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        console.log("verified", result);
        return verified;
      },
    },
  },
});

export const rootSchema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});
