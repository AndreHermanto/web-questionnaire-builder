branch_name="$bamboo_planRepository_branch"
# replace / with - i.e. feature/branch_name to feature-branch-name
# not really needed here, because its always "develop" but you never know
santized_branch_name="${branch_name/\//-}";

# build any release branch
# this should always work, beacuse we wont ever build old release branches
# so this should work out fine
if [ "$branch_name" = "master" ]; then
  rm -rf build

  REACT_APP_ENABLE_LOGS=false npm run build:gateway 2> >(tee build.txt >&2)

  # get the version from package.json
  # from https://gist.github.com/DarrenN/8c6a5b969481725a4413
  PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

  # ecr setup
  ACCOUNT="946635200951"
  REGION="ap-southeast-2"
  REGISTRY="$ACCOUNT.dkr.ecr.$REGION.amazonaws.com"
  REPOSITORY="$bamboo_planRepository_name"
  TAG="v$PACKAGE_VERSION"
  LATEST_TAG="latest-master"

  # create a docker file for aws ecr
  printf "FROM $REGISTRY/infra-nginx:latest\nADD build /usr/share/nginx/html" > Dockerfile

  # make the image
  echo "Creating Docker Image for Web Application $REPOSITORY with Tag:$TAG"
  eval `aws ecr get-login --region $REGION`
  docker build --force-rm=true --tag=$REGISTRY/$REPOSITORY:$TAG .
  docker push $REGISTRY/$REPOSITORY:$TAG

  # update the latest image
  aws ecr batch-delete-image --repository-name $REPOSITORY --image-ids imageTag=$LATEST_TAG
  docker build --force-rm=true --tag=$REGISTRY/$REPOSITORY:$LATEST_TAG .
  docker push $REGISTRY/$REPOSITORY:$LATEST_TAG

  rm Dockerfile
fi



