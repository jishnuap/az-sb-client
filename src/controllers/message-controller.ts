import { Request, Response } from "express";
import { serviceBusClient } from "../service-bus-client/service-bus-client";
import { PublishRequest } from "../models";
import { ReceiveMode } from "@azure/service-bus";

export class MessageController {
    /**
     * @swagger
     * definitions:
     *   PublishReq:
     *     type: object
     *     required:
     *       - data
     *       - topic
     *     properties:
     *       data:
     *         type: object
     *         description: The message payload
     *       correlationId:
     *         type: string
     *         description: Correlation id
     *         example: 634908dd-9189-411f-864f-bab188d22bee
     *       messageId:
     *         type: number
     *         description: The message sequence number
     *         example: 1
     *       topicName:
     *         type: string
     *         description: The topic to which message needs to be published
     *         example: my-test-topic
     */
    /**
     * @swagger
     * /api/message:
     *   post:
     *     tags:
     *       - Message
     *     name: Publish Service Bus Message
     *     summary: API to publish Azure Service Bus
     *     consumes:
     *       - application/json
     *     parameters:
     *       - name: message
     *         in: body
     *         description: The message that needs to be published
     *         schema:
     *           $ref: '#/definitions/PublishReq'
     *
     *     responses:
     *       '200':
     *         description: Message published successfully
     *
     */

    public async publish(req: Request, res: Response): Promise<void> {
        const publishRequest = <PublishRequest>req.body;
        console.log("Request received", publishRequest);
        const topicClient = serviceBusClient.createTopicClient(publishRequest.topicName);
        const topicSender = topicClient.createSender();
        await topicSender.send({
            body: publishRequest.data,
            contentType: "application/json",
            messageId: publishRequest.messageId,
            sessionId: publishRequest.correlationId,
        });

        console.log("message sent");
        const subscriptionClient = serviceBusClient.createSubscriptionClient(publishRequest.topicName, "my-test-topic-sub");

        const rules = await subscriptionClient.getRules();
        if (rules.findIndex((x) => x.name === "ms" + publishRequest.correlationId) < 0) {
            await subscriptionClient.addRule("ms" + publishRequest.correlationId, { correlationId: publishRequest.correlationId });
        }
        const receiver = subscriptionClient.createReceiver(ReceiveMode.peekLock);
        const messages = await receiver.receiveMessages(5);
        if (messages.length === 5) {
            console.log("All messages received");
            const messageIds = messages.map((x) => x.messageId).join(",");
            console.log("messageId", messageIds);
            await Promise.all(messages.map((x) => x.complete()));
        } else {
            console.log("Total message received", messages.length);
        }
        await receiver.close();
        res.send({ message: "Topic sent successfully" });
    }
}
