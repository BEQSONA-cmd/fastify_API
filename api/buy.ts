
// in nextjs
// import { NextRequest, NextResponse } from "next/server";
// import db from "@/data/db";
// import jwt from "jsonwebtoken";
// import { I_user, Product } from "@/components/utils/types";
// import { products } from "@/data/database";

// const SECRET_KEY = "secret_key";

// export async function POST(req: NextRequest) {
//   try 
//   {
//     const id = req.nextUrl.searchParams.get("id");

//     const authHeader = req.headers.get("authorization");
//     const token = authHeader?.split(" ")[1];
//     if (!token)
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    
//     const decoded = jwt.verify(token, SECRET_KEY) as { username: string };
//     const username = decoded.username;

//     const product = products.find((p: Product) => p.id === Number(id)) as Product;

//     const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as I_user;
    
//     if(user.balance < product.price)
//       return NextResponse.json({ message: "Insufficient balance" }, { status: 400 });

//     db.prepare("UPDATE users SET balance = ? WHERE username = ?").run(user.balance - product.price, username);
//     return NextResponse.json({ message: "Balance updated successfully" });
//   } 
//   catch (error) 
//   {
//     console.log(error)
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }

// this is request :
// const updateRes = await fetch(`http://localhost:5555/api/buy?id=${product.id}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json",
//       "authorization": `Bearer ${Cookies.get("authToken")}`
//      },
//   });

// in fastify

import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import db from "../data/db";
import { I_user, Product } from "../types";
import { products } from "../data/database";

const SECRET_KEY = "secret_key";

export default async function buyRoutes(fastify: FastifyInstance) {
    fastify.post("/api/buy", async (req, res) => {
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