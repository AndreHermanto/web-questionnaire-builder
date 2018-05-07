kurbernete_dir = "kurbernete_dir";

/home/bamboo/google-cloud-sdk/bin/gcloud config set project genomeone-sandbox
/home/bamboo/google-cloud-sdk/bin/gcloud container clusters get-credentials genomeone-sandbox
/home/bamboo/google-cloud-sdk/bin/kubectl delete deployment $bamboo_planRepository_name || echo 'init' && /home/bamboo/google-cloud-sdk/bin/kubectl create -f ./$kurbernete_dir/$bamboo_planRepository_name-deployment.yaml || echo 'done'
