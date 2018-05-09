PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

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

# delete release branch
git branch -d release/$PACKAGE_VERSION

# push all the stuff to origin
git push origin master
git push origin develop
git push origin $PACKAGE_VERSION
