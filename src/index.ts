import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { messageRouter } from "./routes";
import { swaggerOptions } from "./swagger/swagger-options";
import * as bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

let PORT = 4000;
if (process.env.PORT) {
    PORT = +process.env.PORT;
}

app.use("/api/message", messageRouter);

const specs = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
