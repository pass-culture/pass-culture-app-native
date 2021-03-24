 #!/bin/bash

set -e

check_branch(){
  CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

  if [[ "$CURRENT_BRANCH" != "staging" ]];
  then
    echo "Wrong branch, checkout staging to get the last code version tested by the POs, to deploy to production"
    exit 1
  fi
}

check_branch

git pull

hub pull-request -m "Production hard deploy" -b production --browse