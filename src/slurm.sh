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

sbatch --job-name="$design_name"-"$tag" --output=slurm-"$tag".out --nodes=1 -t00:50:00 ./src/openlane-job.sh --cb=https://storage.googleapis.com/model-genius-552-singularity --ob=gs://model-genius-552-singularity-job-out "$@"
