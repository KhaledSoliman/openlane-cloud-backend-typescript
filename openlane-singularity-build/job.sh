#!/usr/bin/env bash

module load singularity/3.7.3

srun ./workload.sh ${1} ${2}

module unload singularity/3.7.3

exit 0
