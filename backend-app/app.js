import express from "express";
import router from "./routes/route.js";
import notFoundMiddleWare from "./middleware/notFound.js";
import errorMiddleWareHandler from "./middleware/errorHandler.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json())

app.use('/strings', router);

app.use(notFoundMiddleWare);
app.use(errorMiddleWareHandler);

export default app;