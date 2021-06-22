import express from "express";
import graphqlRouter from "./routes/graphql";
const exp = express();

exp.listen(8080, () => {
  console.log("Server listening on port 8080");
});

exp.use("/", graphqlRouter);
