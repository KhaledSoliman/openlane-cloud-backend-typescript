import { Scheduler } from "../services";
import { logger, database } from "../utils";


export const schedulerJobQueueController = async (data) => {
    const jobDetails = JSON.parse(data.value).message;
    const scheduler = await Scheduler.getInstance();

    await database()["job"].update({status: "preparing-workflow"}, {where: {id: jobDetails.id}});

    let job = await database()["job"].findByPk(jobDetails.id);
    job = job.get({plain: true});

    if (jobDetails.regressionScript) {
        job.regressionScript = jobDetails.regressionScript;
        console.log(job);
    }


    await scheduler.addJobToQueue(job)
        .then(() => logger.info(`Scheduler Service:: Scheduled new job to enter workflow [${jobDetails.id}]`))
        .catch(async () => await database()["job"].update({status: "failed"}, {where: {id: jobDetails.id}}));

};

export const schedulerJobRequeueController = async (data) => {
    const jobDetails = JSON.parse(data.value).message;
    console.dir(jobDetails);
    const scheduler = await Scheduler.getInstance();
    await scheduler.addJobToQueue(jobDetails);
};
