import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import db from "../data/db";
import jwt from "jsonwebtoken";
import { I_user } from "../types";


const SECRET_KEY: string = "secret_key";

export default async function loginRoutes(fastify: FastifyInstance) {
  fastify.post("/api/login", async (req: FastifyRequest, res: FastifyReply) => {
    const { username, password } = req.body as I_user;

    try {
      const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as I_user;

      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.code(401).send({ message: "Invalid username or password" });
      }

      const token = jwt.sign({ username: user.username, balance: user.balance }, SECRET_KEY);


      res.setCookie("authToken", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return res.send({ message: "Login successful" });
    } catch (error) {
      return res.code(500).send({ message: "Internal Server Error" });
    }
  });
}

