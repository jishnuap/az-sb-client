import { ServiceBusClient } from "@azure/service-bus";

const connectionString = process.env.SB_CONNECTION_STRING || "";

export const serviceBusClient = ServiceBusClient.createFromConnectionString(connectionString);
