// --job-name=TestJob --ntasks=3 --cpus-per-task=4 --partition=
export default {
    switches: {
        new_relic: false,
    },
    databases: {
        sqlite: {
            enable: true,
            database_name: "openlane.sqlite"
        },
        redis: {
            enable: true,
            host: "redis",
            port: "6379",
        }
    },
    slurm: {
        batchJob: ""
    },
    openlane: {
        path: "/apps/openlane",
        directories: {
            scripts: "scripts",
            designs: "designs",
            runs: "runs",
            reports: "reports",
            regressionResults: "regression_results",
            logs: "logs",
        },
        job: {
            executionCommand: "sbatch --nodes=1 -t00:50:00 ./app/src/openlane-job.sh https://storage.googleapis.com/copper-array-312208-singularity gs://copper-array-312208-singularity-job-out",
            outDirectories: {
                downloads: "./src/downloads",
                reports: "./src/reports",
            },
            stages: [
                "synthesis",
                "floorplan",
                "placement",
                "cts",
                "routing",
                "lvs",
                "magic"
            ]
        }
    }
};
