#!/usr/bin/env bash
ssh localhost "sbatch --nodes=1 -t00:50:00 ./app/src/openlane-job.sh https://storage.googleapis.com/copper-array-312208-singularity gs://copper-array-312208-singularity-job-out" "$@"
