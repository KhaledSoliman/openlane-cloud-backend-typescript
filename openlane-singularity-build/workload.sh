#!/usr/bin/env bash

set -x

cb=${1}   # container bucket
ob=${2}   # output bucket

# create a temporary directory so that multiple jobs on the same
# don't interfere with one another
tmpdir=$(mktemp -d)
cd ${tmpdir}

# generates a file named: 2d_turbulence_vorticity.mp4
singularity run ${cb}/oceananigans.sif

# append a random string to make the file name unique
rs=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)
mp4="${ob}/2d_turbulence_vorticity_${rs}.mp4"

  # write the output file to the output bucket with the unique name
  # and make it readable
gsutil cp ./2d_turbulence_vorticity.mp4 ${mp4}
gsutil acl ch -g All:R ${mp4}

# clean up and exit
rm 2d_turbulence_vorticity.mp4

cd

rm -rf ${tmpdir}

exit 0
