branch_name="$bamboo_planRepository_branch"
# replace / with - i.e. feature/branch_name to feature-branch-name
# not really needed here, because its always "develop" but you never know
santized_branch_name="${branch_name/\//-}";

# build any release branch
# this should always work, beacuse we wont ever build old release branches
# so this should work out fine
if  [[ $branch_name == release/* ]] ;
then
  rm -rf build

  REACT_APP_ENABLE_LOGS=false npm run build:gateway 2> >(tee build.txt >&2)

  printf "FROM 822459375388.dkr.ecr.ap-southeast-2.amazonaws.com/infra-nginx:latest\nADD build /usr/share/nginx/html" > Dockerfile

  echo "Creating Docker Image for Web Application $bamboo_planRepository_name with Tag:latest-release-candidate"
  eval `aws ecr get-login --region ap-southeast-2`
  docker build --force-rm=true --tag=822459375388.dkr.ecr.ap-southeast-2.amazonaws.com/$bamboo_planRepository_name:latest-release-candidate .

  aws ecr batch-delete-image --repository-name $bamboo_planRepository_name --image-ids imageTag=latest-release-candidate
  docker push 822459375388.dkr.ecr.ap-southeast-2.amazonaws.com/$bamboo_planRepository_name:latest-release-candidate

  rm Dockerfile
fi
