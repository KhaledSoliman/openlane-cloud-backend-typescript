import SequelizeDB from "./src/sequelize";
import  { logger } from "../src/utils";

const initialize = async (config) => {
    try {
        const sequelizeDriver = new SequelizeDB(config);
        await sequelizeDriver.initializeDriver();
        await sequelizeDriver.loadModels();
        return sequelizeDriver.getSequelizeInstance();
    } catch (error) {
        logger.error(`SQLITE_CONNECTOR :: Error connecting to SQLITE ${JSON.stringify(error.message)}`);
        logger.error(error);
        logger.error(error.stack);
    }
};

export default {
    initialize
};
