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
        path: "src/openlane_working_dir/openlane",
        directories: {
            scripts: "scripts",
            designs: "designs",
            runs: "runs",
            reports: "reports",
            regressionResults: "regression_results",
            logs: "logs",
        },
        job: {
            executionCommand: "/app/src/openlane-run.sh",
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
