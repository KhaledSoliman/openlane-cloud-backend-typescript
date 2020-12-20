import { MicroService, config } from "../utils";
import * as fs from "fs";
import * as archiver from "archiver";
import * as shell from "shelljs";

export default class Storage extends MicroService {
    public static storage;
    readonly config;

    constructor(config) {
        super();
        this.config = config;
    }

    public static async getInstance(): Promise<Storage> {
        if (!this.storage) {
            this.storage = new Storage(config.openlane);
            await this.storage.init("storage", ["storage-out"], ["storage-in"]);
            return this.storage;
        }
        return this.storage;
    }

    async archive(jobDetails) {
        return new Promise(resolve => {
            for (let i = 0; i < jobDetails.executionData.runs.length; i++) {
                const runPath = `./${this.config.path}/${this.config.directories.designs}/${jobDetails.id}-${jobDetails.designName}/${this.config.directories.runs}/${jobDetails.executionData.runs[i].name}`;
                this.zip(
                    runPath,
                    `./${this.config.job.outDirectories.downloads}/${jobDetails.userUUID}-${jobDetails.id}-${jobDetails.executionData.runs[i].name}.zip`
                );
                shell.exec(`rm -rf ${runPath}`);
            }

            if (jobDetails.type === "exploratory")
                shell.exec(`rm -rf ${this.config.path}/${this.config.directories.scripts}/${jobDetails.executionData.tag}-regression.config`);

            shell.exec(`mv ./${this.config.path}/${this.config.directories.regressionResults}/${jobDetails.executionData.tag}/${jobDetails.executionData.tag}.csv ./${this.config.job.outDirectories.reports}/${jobDetails.id}.csv`);

            resolve();
        });
    }

    zip(inputPath, outputPath) {
        const output = fs.createWriteStream(outputPath);
        const archive = archiver("zip", {
            zlib: {level: 9} // Sets the compression level.
        });
        output.on("close", function () {
            // logger.info(archive.pointer() + " total bytes");
            // logger.info("archiver has been finalized and the output file descriptor has closed.");
        });
        output.on("end", function () {
            // logger.info("Data has been drained");
        });
        archive.on("warning", function (err) {
            // logger.error(err);
        });
        archive.on("error", function (err) {
            // logger.error(err);
        });
        archive.pipe(output);
        archive.directory(inputPath, false).finalize();
    }
}
