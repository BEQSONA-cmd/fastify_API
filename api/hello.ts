import { FastifyInstance } from "fastify";

export default async function helloRoutes(fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });
}
