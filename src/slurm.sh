#!/usr/bin/env bash
sbatch --nodes=1 -t00:50:00 ./src/openlane-job.sh --cb=https://storage.googleapis.com/copper-array-312208-singularity --ob=gs://copper-array-312208-singularity-job-out "$@"
