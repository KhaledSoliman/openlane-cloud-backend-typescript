#!/usr/bin/env bash
module load singularity/3.7.3
    srun ./openlane-run.sh "$@"
module unload singularity/3.7.3

exit 0
