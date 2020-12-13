import { Storage } from "../services";
import { database } from "../utils";


export const storageController = async (data) => {
    let jobDetails = JSON.parse(data.value).message;

    const storage = await Storage.getInstance();

    await database()["job"].update({status: "archiving"}, {where: {id: jobDetails.id}});

    await storage.archive(jobDetails);

    jobDetails = await database()["job"].findByPk(jobDetails.id);

    await storage.publish("storage-out", jobDetails);
};
