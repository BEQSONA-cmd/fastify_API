import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import db from "../data/db";
import { I_user, Product } from "../types";
import { products } from "../data/database";

const SECRET_KEY = "secret_key";

export default async function buyRoutes(fastify: FastifyInstance) {
    fastify.get("/api/buy", async (req, res) => {
        const { id } = req.query as { id: string };
    
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];
        if (!token) {
        return res.code(401).send({ message: "Unauthorized" });
        }
    
        try {
        const decoded = jwt.verify(token, SECRET_KEY) as { username: string };
        const username = decoded.username;
    
        const product = products.find((p: Product) => p.id === Number(id)) as Product;
    
        const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as I_user;
    
        if (user.balance < product.price) {
            return res.code(400).send({ message: "Insufficient balance" });
        }
    
        db.prepare("UPDATE users SET balance = ? WHERE username = ?").run(user.balance - product.price, username);
    
        return res.send({ message: "Balance updated successfully" });
        } catch (error) {
        return res.code(500).send({ message: "Internal Server Error" });
        }
    });
}