import express from "express";
import dotenv from "dotenv";
import { rootSchema } from "./schema/rootSchema.js";
import { graphqlHTTP } from "express-graphql";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();


app.use(
  "/graphql",
  graphqlHTTP({
    schema: rootSchema,
    pretty: true,
    graphiql: true,
  })
);
const DATABASE_URI = process.env.DATABASE_URI;

app.get("/", (req, res) => {
  res.sendStatus(200);
});
const client = new MongoClient(DATABASE_URI);

client
  .connect()
  .then(() => {
    console.log("connected to database");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("failed to connect to database", err);
  });
