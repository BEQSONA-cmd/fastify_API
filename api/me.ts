import { FastifyInstance } from 'fastify';
import jwt from "jsonwebtoken";
import db from "../data/db";
import { I_user } from '../types';

const SECRET_KEY = "secret_key";

export default async function meRoutes(fastify: FastifyInstance)
{
    fastify.get("/api/me", async (req, res) => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];
        
        if (!token) {
            console.log("meRoutes");
            return res.code(401).send({ message: "Unauthorized" });
        }

        try {
            const decoded = jwt.verify(token, SECRET_KEY) as I_user;

            const balance = db.prepare("SELECT balance FROM users WHERE username = ?").get(decoded.username) as { balance: number };

            decoded.balance = balance.balance;

            return res.send({ user: decoded });
        } catch {
            return res.code(401).send({ message: "Invalid Token" });
        }
    });
}
