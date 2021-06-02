import { Git } from "../services";
import { logger, database } from "../utils";


export const gitController = async (data) => {
    const jobDetails = JSON.parse(data.value).message;

    const git = await Git.getInstance();

    await database()["job"].update({status: "cloning"}, {where: {id: jobDetails.id}});

    await git.cloneRepo(jobDetails.repoURL, jobDetails.id, jobDetails.designName)
        .then(() => logger.info(`Git Service:: Cloned job design directory [${jobDetails.id}]`));

    let newJobDetails = await database()["job"].findByPk(jobDetails.id);
    newJobDetails = newJobDetails.get({plain: true});
    if (jobDetails.regressionScript) {
        newJobDetails.regressionScript = jobDetails.regressionScript;
        console.log(newJobDetails);
    }

    await git.publish("git-out", newJobDetails);
};
