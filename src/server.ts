"use strict";
import * as dotenv from "dotenv";
dotenv.config();
import startApp from "./boot";
import { constants, logger, config } from "./utils";

import * as mime from "mime";

const file = "./gulpfile.js";
console.log(mime.getType(file));

// Enable newrelic if switch is on
if (config.switches.new_relic && constants.ENV === constants.ENVIRONMENTS.prod) {
    require("newrelic");
}


const app = (async (): Promise<void> => {
    try {
        return await startApp().then((app) => {
            logger.info(`BOOT :: Application booted successfully!!`);
            // return app;
        });
    } catch (err) {
        logger.error(`BOOT :: Error while booting application from sever.js : ${JSON.stringify(err.message)}`);
    }
})()
    .then((app) => {
        return app;
    });

export default app;
