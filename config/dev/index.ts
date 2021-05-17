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
            executionCommand: "ssh -l ${EXTERNAL_IP} ${HOSTNAME} ./app/src/slurm.sh",
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
