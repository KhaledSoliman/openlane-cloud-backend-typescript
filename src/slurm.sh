#!/usr/bin/env bash
#--chdir
#for arg do
#  shift
#  [ "$arg" = "-inf" ] && continue
#  set -- "$@" "$arg"
#done

while [ $# -gt 0 ]; do
  case "$1" in
    --tag=*)
      tag="${1#*=}"
      ;;
    --design-name=*)
      design_name="${1#*=}"
      ;;
    --regression-script=*)
      regression_script="${1#*=}"
      ;;
    --threads=*)
      threads="${1#*=}"
      ;;
    --cpus=*)
      cpus="${1#*=}"
      ;;
    --memory=*)
      memory="${1#*=}"
      ;;
  esac
  shift
done

sbatch --job-name="$design_name" --output=slurm-"$tag".out -"$tag" --nodes=1 -t00:50:00 ./src/openlane-job.sh --cb=https://storage.googleapis.com/copper-array-312208-singularity --ob=gs://copper-array-312208-singularity-job-out "$@"
