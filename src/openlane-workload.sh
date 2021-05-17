#!/usr/bin/env bash
set -x
cb=${1}   # container bucket
ob=${2}   # output bucket

OPEN_LANE_PATH=/apps/openlane
PDK_ROOT=/apps/openlane/pdks
cd /apps/openlane
singularity run -B /apps/openlane:/openLANE_flow -B /apps/openlane/pdks:/apps/openlane/pdks --env "PDK_ROOT=/apps/openlane/pdks" ${cb}/openlane.sif python3 run_designs.py --designs spm xtea md5 aes256 --tag test --threads 3 --disable_timestamp --clean

# append a random string to make the file name unique
rs=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)
outputDir="${ob}/spm${rs}"

# write the output file to the output bucket with the unique name
# and make it readable
gsutil cp /apps/openlane/spm/designs/runs/ ${outputDir}
gsutil acl ch -g All:R ${outputDir}

exit 0
