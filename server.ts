import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";

import helloRoutes from "./api/hello";
import registerRoutes from "./api/register";
import loginRoutes from "./api/login";
import adminRoutes from "./api/admin";
import meRoutes from "./api/me";
import buyRoutes from "./api/buy";

const fastify = Fastify({ logger: false });

fastify.register(cors, {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
});

fastify.register(helloRoutes);
fastify.register(registerRoutes);
fastify.register(loginRoutes);
fastify.register(meRoutes);
fastify.register(adminRoutes);
fastify.register(buyRoutes);
fastify.register(cookie);

const startServer = async () => 
{
  try {
    await fastify.listen({ port: 5555, host: "0.0.0.0" });
    console.log("Fastify server is running on http://localhost:5555");
  } catch (err) {
    // fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
