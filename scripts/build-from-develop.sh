branch_name="$bamboo_planRepository_branch"
# replace / with - i.e. feature/branch_name to feature-branch-name
# not really needed here, because its always "develop" but you never know
santized_branch_name="${branch_name/\//-}";

# build a version, with no logging, make docker image and push to GCP
# this will end up at https://sandbox.genome.one/APP_NAME
if [ "$branch_name" = "develop" ]; then
  rm -rf build

  REACT_APP_ENABLE_LOGS=false npm run build:gateway 2> >(tee build.txt >&2)
  
  printf "FROM gcr.io/genomeone-sandbox/infra-nginx:latest\nADD build /usr/share/nginx/html" > Dockerfile
  echo "Creating Docker Image for Web Application" $bamboo_planRepository_name "with Tag:latest-"$santized_branch_name
  /home/bamboo/google-cloud-sdk/bin/gcloud config set project genomeone-sandbox
  /home/bamboo/google-cloud-sdk/bin/gcloud container clusters get-credentials genomeone-sandbox
  docker build --force-rm=true --tag=gcr.io/genomeone-sandbox/$bamboo_planRepository_name:latest-$santized_branch_name .
  /home/bamboo/google-cloud-sdk/bin/gcloud -q container images untag --quiet gcr.io/genomeone-sandbox/$bamboo_planRepository_name:latest-$santized_branch_name || true
  tagdigest=$(/home/bamboo/google-cloud-sdk/bin/gcloud container images list-tags gcr.io/genomeone-sandbox/$bamboo_planRepository_name --filter='-tags:*'  --format='get(digest)' --limit=1)
  /home/bamboo/google-cloud-sdk/bin/gcloud container images delete --quiet gcr.io/genomeone-sandbox/$bamboo_planRepository_name@"$tagdigest" || true
  /home/bamboo/google-cloud-sdk/bin/gcloud docker -- push gcr.io/genomeone-sandbox/$bamboo_planRepository_name:latest-$santized_branch_name
  rm Dockerfile
fi

