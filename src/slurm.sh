#!/usr/bin/env bash
#--chdir
for i in "$@"; do
    case $i in
    --tag=*)
    tag="${i#*=}"
    ;;
    --design-name=*)
    design_name="${i#*=}"
    ;;
    --threads=*)
    threads="${i#*=}"
    ;;
    --cpus=*)
    cpus="${i#*=}"
    ;;
    --memory=*)
    memory="${i#*=}"
    ;;
    *)
    ;;
esac
done

sbatch --job-name="$design_name"-"$tag" --output=slurm-"$tag".out --nodes=1 -t00:50:00 ./src/openlane-job.sh --cb=https://storage.googleapis.com/copper-array-312208-singularity --ob=gs://copper-array-312208-singularity-job-out "$@"
