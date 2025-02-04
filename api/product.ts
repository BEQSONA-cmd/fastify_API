
// request:
// export const ProductProvider = ({ children }: { children: ReactNode }) => {
//     const [products, setProducts] = useState([]);
//     useEffect(() => {
//         fetch("http://localhost:5555/api/products")
//             .then((res) => res.json())
//             .then((data) => setProducts(data));
//     }, []);
//     return (
//         <ProductContext.Provider value={[products, setProducts]}>
//             {children}
//         </ProductContext.Provider>
//     );
// };

// should return products from ../data/database.ts
import { FastifyInstance } from "fastify";
import { products } from "../data/database";

export default async function productRoutes(fastify: FastifyInstance) {
    fastify.get("/api/products", async (req, res) => {
        return res.send({ products });
    });
}

