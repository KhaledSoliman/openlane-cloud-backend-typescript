#while [ $# -gt 0 ]; do
#  case "$1" in
#    --rootPath=*)
#      rootPath="${1#*=}"
#      ;;
#    *)
#      printf "* Invalid argument Passed *"
#      exit 1
#  esac
#  shift
#done
mkdir openlane_working_dir
mkdir openlane_working_dir/pdks
export PDK_ROOT="$(pwd)/openlane_working_dir/pdks"
export RUN_ROOT="$(pwd)/openlane_working_dir/openlane"
export IMAGE_NAME=openlane:cloud
echo "$PDK_ROOT"
echo "$RUN_ROOT"
echo $IMAGE_NAME
cd openlane_working_dir
git clone https://github.com/efabless/openlane.git --branch develop
cd openlane
make openlane
make skywater-pdk
make all-skywater-libraries
make open_pdks
make build-pdk
echo "done installing"
exit 0
