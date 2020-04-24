import express, { Request, Response } from "express";
import { messageController } from "../controllers";

export const router = express.Router({
    strict: true,
});

router.post("/", (req: Request, res: Response) => {
    messageController.publish(req, res);
});
