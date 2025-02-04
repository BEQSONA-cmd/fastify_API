import { FastifyInstance } from "fastify";
import db from "../data/db";

export default async function adminRoutes(fastify: FastifyInstance) 
{
    fastify.get("/api/admin/users", async (req, res) => 
    {
        const users = db.prepare("SELECT * FROM users").all();
        return res.send(users);
    });
    
    fastify.post("/api/admin/users/update", async (req, res) => {
        const { id, username, balance } = req.body as { id: number, username: string, balance: number };
    
        db.prepare("UPDATE users SET username = ?, balance = ? WHERE id = ?").run(
        username,
        balance,
        id
        );
    
        return res.send({ message: "User updated successfully" });
    });
}
