import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { UserRegisterResolver } from "./modules/user/resolvers/User";
import jwt from "express-jwt";

const main = async () => {
  // Create your TypeORM connection (ormconfig.json)
  await createConnection();
  // Define the schema
  const schema = await buildSchema({
    resolvers: [UserRegisterResolver],
  });
  // Create a new apollo server instance
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => {
      const context = { req, user: req.user };
      return context;
    },
  });
  // Declare a new express app
  const app = Express();

    // Wrap the express app with express-jwt
  app.use(
    "/graphql",
    jwt({
      secret: "RodzySuperDuperSecretCode",
      credentialsRequired: false,
    })
  );

  // Parse the app to be compatible with Apollo Serve
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log("⚡ Running on http://localhost:4000/graphql");
  });
};
main();
