export interface PublishRequest {
    correlationId: string;
    messageId: number;
    topicName: string;
    data: any;
}
