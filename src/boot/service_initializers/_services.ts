import { logger } from "../../utils";
import {
    schedulerJobQueueController,
    schedulerJobRequeueController,
    gitController,
    openlaneExecutionController,
    storageController,
} from "../../controllers";

import {
    Scheduler,
    Git,
    OpenlaneExecution,
    Storage,
} from "../../services";

/*
* On successful initialization invoke resolve
* Resolve will trigger next initializer
*
* On fail initialization you can invoke reject
* Reject will stop the booting up of express app. In case you don't want to stop booting process if initialization fails invoke resolve
 */

async function registerConsumer(service, consumptionTopic, serviceController) {
    const serviceInstance = await service.getInstance();
    serviceInstance.registerConsumer(consumptionTopic, serviceController);
}

const init = async function (): Promise<void> {
    try {
        // do your initialization here
        logger.info("BOOT :: booting services...");
        await registerConsumer(Scheduler, "job-out", schedulerJobQueueController);
        await registerConsumer(Scheduler, "git-out", schedulerJobRequeueController);
        await registerConsumer(Scheduler, "resources-out", schedulerJobRequeueController);
        await registerConsumer(Scheduler, "storage-out", schedulerJobRequeueController);
        await registerConsumer(Git, "git-in", gitController);
        await registerConsumer(OpenlaneExecution, "resources-in", openlaneExecutionController);
        await registerConsumer(Storage, "storage-in", storageController);
        logger.info("BOOT :: all services booted...");
    } catch (err) {
        console.error(err);
        logger.error(`BOOT :: Error initializing one of the services {data} : ${JSON.stringify(err.message)}`);
        throw  new Error(err.message);
    }
};

export default init;







