#!/bin/bash
set -ex

branch_name="$bamboo_planRepository_branch"
app_name="$bamboo_planRepository_name"
clean_app_name=${app_name:4}
PART_OF_BRANCH_NAME=`echo "${bamboo_repository_git_branch}" | cut -d'/' -f2 | cut -d'-' -f1,2`


# Build for sandbox mock server 
rm -rf build

npm run build:demo 2> >(tee build.txt >&2)

mkdir -p $branch_name
cp -R build/* $branch_name

# SSH to sandbox
ssh 35.189.35.255 /bin/bash <<EOF
mkdir -p "/var/nfs/demo/$app_name/$branch_name"
exit
EOF

# Copy the files over
scp -r $branch_name/. 35.189.35.255:/var/nfs/demo/$app_name/$branch_name/

# Build for sandbox gateway
rm -rf build

REACT_APP_ENABLE_LOGS=true npm run build:gateway 2> >(tee build.txt >&2)
mkdir -p $branch_name
cp -R build/* $branch_name

# SSH to sandbox
echo "Creating folder on Sandbox - /var/nfs/demo/uat/$app_name/$branch_name"
ssh 35.189.35.255 /bin/bash <<EOF
mkdir -p "/var/nfs/demo/uat/$app_name/$branch_name"
exit
EOF

# Copy the files over
scp  -r $branch_name/. 35.189.35.255:/var/nfs/demo/uat/$app_name/$branch_name/


# Build the docker image for sandbox
printf "FROM gcr.io/genomeone-sandbox/infra-nginx:latest\nADD build /usr/share/nginx/html" > Dockerfile
echo "Creating Docker Image for Web Application" $bamboo_planRepository_name "with Tag:latest-"$PART_OF_BRANCH_NAME
/home/bamboo/google-cloud-sdk/bin/gcloud config set project genomeone-sandbox
/home/bamboo/google-cloud-sdk/bin/gcloud container clusters get-credentials genomeone-sandbox
docker build --force-rm=true --tag=gcr.io/genomeone-sandbox/$bamboo_planRepository_name:latest-$PART_OF_BRANCH_NAME .
/home/bamboo/google-cloud-sdk/bin/gcloud -q container images untag --quiet gcr.io/genomeone-sandbox/$bamboo_planRepository_name:latest-$PART_OF_BRANCH_NAME || true
tagdigest=$(/home/bamboo/google-cloud-sdk/bin/gcloud container images list-tags gcr.io/genomeone-sandbox/$bamboo_planRepository_name --filter='-tags:*'  --format='get(digest)' --limit=1)
/home/bamboo/google-cloud-sdk/bin/gcloud container images delete --quiet gcr.io/genomeone-sandbox/$bamboo_planRepository_name@"$tagdigest" || true
/home/bamboo/google-cloud-sdk/bin/gcloud docker -- push gcr.io/genomeone-sandbox/$bamboo_planRepository_name:latest-$PART_OF_BRANCH_NAME
rm Dockerfile