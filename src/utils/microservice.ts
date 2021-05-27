import KafkaProducer from "../../kafka";
import KafkaConsumer from "../../kafka";
import { logger } from "./index";

export default class MicroService {
    private producers: Map<string, string>;
    private consumers: Map<string, string>;

    constructor() {
        this.producers = new Map();
        this.consumers = new Map();
    }

    public async init(consumerGroup, productionTopics, consumptionTopics, partition = 0): Promise<any> {
        for (let i = 0; i < productionTopics.length; i++) {
            const productionTopic = productionTopics[i];

            // Initialize Producer
            this.producers[productionTopic] = await KafkaProducer.initialize("PRODUCER", {
                host: "localhost:19092",
                topic: productionTopic,
                partition: partition
            });

            this.producers[productionTopic].on("error", (err) => {
                logger.error(productionTopic + ":: " + err);
            });
        }

        for (let i = 0; i < consumptionTopics.length; i++) {
            const consumptionTopic = consumptionTopics[i];

            // Initialize Consumer
            this.consumers[consumptionTopic] = await KafkaConsumer.initialize("CONSUMER", {
                host: "localhost:19092",
                topic: consumptionTopic,
                groupId: consumerGroup,
            });
        }
    }

    async publish(productionTopic, msg) {
        try {
            await this.producers[productionTopic].publish({
                message: msg,
            });
            logger.info(productionTopic + ":: Passed message to " + productionTopic);
        } catch (e) {
            throw new Error(e);
        }
    }

    registerConsumer(consumptionTopic, listener) {
        this.consumers[consumptionTopic].on("message", (data) => {
            listener(data);
        });
        logger.info(consumptionTopic + ":: Consumer Registered!");
    }

}
