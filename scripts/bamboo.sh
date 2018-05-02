#!/bin/bash
set -ex

# Get the branch
#./repo.sh

# NPM Install
./scripts/install.sh

# Tests
./scripts/test.sh

# Demo on Sandbox
./scripts/build-for-demo.sh

# Real Sandbox (from develop branch)
./scripts/build-from-develop.sh

# Release Candidates
./scripts/build-from-release.sh

# ECR
#./scripts/docker.sh
