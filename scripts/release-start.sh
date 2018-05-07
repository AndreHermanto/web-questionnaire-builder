#!/bin/bash
if [ -z "$(git status --porcelain)" ]; then 
  echo "Starting Release"
else 
  echo "This repo has uncommited changes"
  exit
fi

echo '1: bug fixes'
echo '2: some new features and bug fixes'
echo '3: a big change'

read -p 'Enter number: ' TYPE

case $TYPE in
  1)
    npm --no-git-tag-version version patch
    ;;
  2)
    npm --no-git-tag-version version minor
    ;;
  3)
    npm --no-git-tag-version version major
    ;;
  *)
    echo 'Hmm...dont know that number'
    ;;
esac


PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

git checkout -b release/$PACKAGE_VERSION develop

git add -A
git commit -am "Release $PACKAGE_VERSION"






