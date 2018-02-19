#!/bin/bash
set -ex

PART_OF_BRANCH_NAME=`echo "${bamboo_repository_git_branch}" | cut -d'/' -f2 | cut -d'-' -f1,2`
BRANCH_NAME=`echo "${bamboo_repository_git_branch}"`
app_name="$bamboo_planRepository_name"
clean_app_name=${app_name:4}

rm -rf build
npm run build:uat 2> >(tee build.txt >&2)

# AWS
printf "FROM 822459375388.dkr.ecr.ap-southeast-2.amazonaws.com/infra-nginx:latest\nADD build /usr/share/nginx/html" > Dockerfile

echo "Creating Docker Image for Web Application" $bamboo_planRepository_name "with Tag:latest-"$PART_OF_BRANCH_NAME
eval `aws ecr get-login --region ap-southeast-2`
docker build --force-rm=true --tag=822459375388.dkr.ecr.ap-southeast-2.amazonaws.com/$bamboo_planRepository_name:latest-$PART_OF_BRANCH_NAME .

aws ecr batch-delete-image --repository-name $bamboo_planRepository_name --image-ids imageTag=latest-$PART_OF_BRANCH_NAME
docker push 822459375388.dkr.ecr.ap-southeast-2.amazonaws.com/$bamboo_planRepository_name:latest-$PART_OF_BRANCH_NAME

rm Dockerfile

#GCP
printf "FROM gcr.io/genomeone-sandbox/infra-nginx:latest\nADD build /usr/share/nginx/html" > Dockerfile

echo "Creating Docker Image for Web Application" $bamboo_planRepository_name "with Tag:latest-"$PART_OF_BRANCH_NAME
docker build --force-rm=true --tag=gcr.io/genomeone-sandbox/$bamboo_planRepository_name:latest-$PART_OF_BRANCH_NAME .

/home/bamboo/google-cloud-sdk/bin/gcloud -q container images untag --quiet gcr.io/genomeone-sandbox/$bamboo_planRepository_name:latest-$PART_OF_BRANCH_NAME || true
tagdigest=$(/home/bamboo/google-cloud-sdk/bin/gcloud container images list-tags gcr.io/genomeone-sandbox/$bamboo_planRepository_name --filter='-tags:*'  --format='get(digest)' --limit=1)
/home/bamboo/google-cloud-sdk/bin/gcloud container images delete --quiet gcr.io/genomeone-sandbox/$bamboo_planRepository_name@"$tagdigest" || true
/home/bamboo/google-cloud-sdk/bin/gcloud docker -- push gcr.io/genomeone-sandbox/$bamboo_planRepository_name:latest-$PART_OF_BRANCH_NAME

rm Dockerfile
