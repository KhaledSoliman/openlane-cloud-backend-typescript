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
            host: "127.0.0.1",
            port: "6379",
        }
    },
    openlane: {
        path: "openlane_working_dir/openlane",
        directories: {
            scripts: "scripts",
            designs: "designs",
            runs: "runs",
            reports: "reports",
            regressionResults: "regression_results",
            logs: "logs",
        },
        job: {
            executionCommand: "sudo ./openlane-run.sh",
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
