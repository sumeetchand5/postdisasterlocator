import client from "./client";

const endpoint = "/posts";

const getTest = () => {
  client.get("/posts");
};

export default {
  getTest,
};
