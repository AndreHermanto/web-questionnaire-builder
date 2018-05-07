PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

# merge the release branch into master
git checkout master
git merge --no-ff release/$PACKAGE_VERSION
git tag -a $PACKAGE_VERSION
git push origin
git push origin $PACKAGE_VERSION

# merge the release branch into develop
git checkout develop
git merge --no-ff release/$PACKAGE_VERSION
git push origin $PACKAGE_VERSION

# delete the release branch
git branch -d release/$PACKAGE_VERSION