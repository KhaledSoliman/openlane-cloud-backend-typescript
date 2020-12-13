/*
* On successful initialization invoke resolve
* Resolve will trigger next initializer
*
* On fail initialization you can invoke reject
* Reject will stop the booting up of express app. In case you don't want to stop booting process if initialization fails invoke resolve
 */


import { config, Connections, constants, logger, sequelize } from "../../utils";

const init = async function (): Promise<void> {
    try {
        if (config.databases.sqlite.enable) {
            logger.info(`BOOT :: Connecting SQLITE`);
            const sqliteClient = await sequelize.initialize({
                "database": config.databases.sqlite.database_name,
                "connectionLimit": 5,
            });
            Connections.set(constants.CONNECTIONS.SQLITE, sqliteClient);
        }
    } catch (err) {
        logger.error(`BOOT :: Error connecting to sqlite database :: message: ${err.message} :: stack : ${err.stack}`);
        throw  new Error(err.message);
    }
};

export default init;
