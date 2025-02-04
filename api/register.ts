import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import db from "../data/db";
import { I_user } from "../types";

export default async function registerRoutes(fastify: FastifyInstance) {
  fastify.post("/api/register", async (req, res) => {
    const { username, password } = req.body as I_user;

    try {
      // Check if user already exists
      const existingUser = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

      if (existingUser) {
        return res.code(400).send({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Insert new user
      db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username, hashedPassword);

      return res.send({ message: "Registration successful" });
    } catch (error) {
      return res.code(500).send({ message: "Internal Server Error" });
    }
  });
}
