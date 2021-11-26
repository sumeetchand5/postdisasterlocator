import { create } from "apisauce";

const apiClient = create({
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: { Accept: "application/vnd.github.v3+json" },

});

export default apiClient;
