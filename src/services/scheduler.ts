import { logger, database, MicroService, config } from "../utils";
import * as BeeQueue from "bee-queue";


/**
 * Business Logic function:
 * take cheese from a box an squeeze it
 */
export default class Scheduler extends MicroService {
    public static scheduler;
    private queue: BeeQueue<any>;

    public static async getInstance(): Promise<Scheduler> {
        if (!this.scheduler) {
            this.scheduler = new Scheduler();
            await this.scheduler.init("scheduler",
                ["git-in", "resources-in", "storage-in", "notification-in"],
                ["job-out", "git-out", "resources-out", "storage-out"]
            );
            return this.scheduler;
        }
        return this.scheduler;
    }

    constructor() {
        super();
        this.queue = new BeeQueue("jobQueue", {
            redis: {
                host: config.databases.redis.host,
                port: parseInt(config.databases.redis.port)
            }
        });
        const self = this;


        /**
         * Register Queue Processor
         */
        this.queue.process(async function (job) {
            switch (job.data.status) {
                case "scheduled":
                    /**
                     * Next Stage: Cloning
                     */
                    await self.publish("git-in", job.data)
                        .then(() => logger.info(`Stage: Cloning | Job: ${job.data.id}`));
                    break;
                case "cloning":
                    /**
                     * Next Stage: running
                     */
                    await self.publish("resources-in", job.data)
                        .then(() => logger.info(`Stage: Running | Job: ${job.data.id}`));
                    break;
                case "running":
                    /**
                     * Next Stage: archiving
                     */
                    await self.publish("storage-in", job.data)
                        .then(() => logger.info(`Stage: Archiving | Job: ${job.data.id}`));
                    break;
                case "archiving":
                    /**
                     * Next Stage: Completed
                     */
                    // await this.git.deleteRepo(job.id, jobDescription.designName);
                    await database()["job"].update({
                        status: "completed",
                        completedAt: new Date().getTime()
                    }, {where: {id: job.data.id}})
                        .then(() => logger.info(`Stage: Completed | Job: ${job.data.id}`));
                    break;
                case "stopping":
                    await database()["run"].update({status: "stopped"}, {where: {jobId: job.data.id}});
                    break;
                default:
                    throw new Error("Undefined Job Stage");
            }
            return "wtf";
            // if (job.data.notificationsEnabled) {
            //     self.notification.sendPushNotification("Job Scheduler", "Your job repository is currently being cloned", job.data.regToken);
            // }

            // if (job.data.notificationsEnabled) {
            //     self.notification.sendPushNotification("Job Scheduler", "Your job is now running", job.data.regToken);
            //     self.notification.sendMail(job.data.email, `No-reply: Job #${job.id} processed`, `Job #${job.id} processed with repo url: ${job.data.repoURL}`);
            // }

        });
    }

    /**
     *
     * @param jobDetails
     */
    async addJobToQueue(jobDetails) {
        // jobDescription.designName = `${uuid}-${jobDescription.repoURL.split('/').pop()}`;
        const job = this.queue.createJob(jobDetails);
        await job.setId(`${jobDetails.id}-${jobDetails.status}`).retries(0).timeout(86400000).save();
        // if (jobDetails.notificationsEnabled) {
        //     this.publish("notification-in", {
        //         title: "Job Scheduler",
        //         body: "Your Job is now scheduled",
        //         token: jobDetails.regToken
        //
        //     });
        //     //this.notification.sendMail(job.data.email, `No-reply: Job #${job.id} submitted`, `Job #${job.id} submitted with repo url: ${job.data.repoURL}`);
        // }

        /**
         * Register Job Event Listeners
         */
        job.on("succeeded", async (stopped) => {
            logger.info("Scheduler:: Stage Done");
        });

        job.on("failed", async (result) => {
            /**
             * Stage: Failed
             */
            logger.error(`Failure result for job ${job.id}: ${result}`);
            await database()["job"].update({status: "failed"}, {where: {jobId: job.id}});
        });
    }
}
