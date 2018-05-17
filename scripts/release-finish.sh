PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

WEB_COMPONENTS_VERSION=$(cat package.json \
  | grep web-components \
  | head -1 \
  | awk -F# '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

if [[ $WEB_COMPONENTS_VERSION != *"semver"* ]]; then
  echo "Web-components version is invalid for release"
  exit
fi
  
  

# merge the release branch into master
echo "Checking out master from origin"
echo "This will erase any changes you have made in master that aren't pushed to origin"
git checkout -B master origin/master
git merge --no-ff --no-edit release/$PACKAGE_VERSION 
git tag -a $PACKAGE_VERSION -m "$PACKAGE_VERSION"

# merge the release branch into develop
echo "Checking out develop from origin"
echo "This will erase any changes you have made in develop that aren't pushed to origin"
git checkout -B develop origin/develop
git merge --no-ff --no-edit release/$PACKAGE_VERSION
npm install GenomeOne/web-components#master --save
git commit -am "Change web-components back to master"

# delete release branch
git branch -d release/$PACKAGE_VERSION

# push all the stuff to origin
git push origin master
git push origin develop
git push origin $PACKAGE_VERSION
