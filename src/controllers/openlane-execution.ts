import { OpenlaneExecution } from "../services";
import { database, } from "../utils";

export const openlaneExecutionController = async (data) => {
    let jobDetails = JSON.parse(data.value).message;

    const openlaneExecution = await OpenlaneExecution.getInstance();

    await database()["job"].update({status: "scheduling"}, {where: {id: jobDetails.id}});

    const jobExecutionData = await openlaneExecution.runJob(jobDetails);

    jobDetails = await database()["job"].findByPk(jobDetails.id, {
        raw: true
    });

    // console.dir(jobExecutionData);

    jobDetails.executionData = jobExecutionData;

    // console.dir(jobDetails);

    await openlaneExecution.publish("resources-out", jobDetails);
};
