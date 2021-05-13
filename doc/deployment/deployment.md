# Application deployment

Linked documentation: https://www.notion.so/passcultureapp/Processus-d-ploiement-MES-MEP-App-Native-bc75cbf31d6146ee88c8c031eb14b655

## Testing

Download the app:

- hyperurl.co/pc-testing
  or
- https://appcenter.ms/orgs/pass-Culture/apps/passculture-testing-<PLATFORM:ios|android>

### Soft deploy (automatic)

Most of the time, on testing, you didn't change anything in the native code. If you changed only javascript code, deploy will be **automatic** on CircleCI (deploy-soft-testing job).
Then the build is faster as only the javascript code is published.

The download and installation of the modification will be automatic when you open the app.

- Troubleshoot:
  If you don't see your changes, try to check if the codepush was correctly downloaded. To do so go to "CheatCodes", and click on the "check update" button.
  3 possibilities:
  - it displays "no update found" you are up to date
  - it shows "New version available on AppCenter" you need to go to hyperurl.co/pc-<testing|staging>
  - it download the update and restart the app

### Hard deploy (manual)

If I modified native code, I need to hard deploy:

- `yarn trigger:testing:deploy:patch`
  This will bump the patch number, create a tag `testing_vX.X.X+1` and push it.
  CircleCI will detect the tag and run `deploy-android-testing-hard` & `deploy-ios-testing-hard` jobs (see `.circleci/config.yml` file)

## Staging (MES)

Download the app:

- hyperurl.co/pc-staging
  or
- https://appcenter.ms/orgs/pass-Culture/apps/passculture-staging-<PLATFORM:ios|android>

### Hard deploy (once a week, manual)

To deploy the current version of master in staging, you can run the following commands:

- `yarn trigger:staging:deploy`

This will bump the `minor` version, create a tag `vX.X+1.X` and push it.

- or `trigger:staging:deploy:patch`
  This will bump the `patch` version, create a  tag `vX.X.X+1` and push it.

CircleCI will detect the tag `vX.X.X` and run `deploy-ios-staging-hard` & `deploy-android-staging-hard` jobs (see `.circleci/config.yml` file)

## Production (MEP)

### Hard deploy (when MEP wanted, manual)

- Know which version (and then tag) you want to deploy

- `yarn trigger:production:deploy <tag>`

This will create a tag `prod-hard-deploy`
CircleCI will detect the tag and run `deploy-android-production-hard` & `deploy-ios-production-hard` jobs (see `.circleci/config.yml` file)

## Hotfix

### When

Only if there is a bug in production, we need to hotfix as soon as possible.

### How

1. To list `X.X.X` and `vX.X.X-Y` related tags: `git tag -l | grep X.X.X`
1. Checkout on the tag with the biggest Y (if no tag with Y, checkout on `vX.X.X`)
1. `git checkout -b hotfix/vX.X.X-Y`  *(with `Y` greater that `0`)*
1. Code the fix
1. Commit
1. `git tag vX.X.X-(Y+1)`
1. `git tag hotfix-staging-vX.X.X-(Y+1)`
1. `git push origin hotfix-staging-vX.X.X-(Y+1)`: this will deploy it to `staging`
1. Validate the fix with the PO on staging app (version X.X.X)
1. After PO validation, you can now deploy to production:
1. `git tag hotfix-production-vX.X.X-(Y+1)`
1. `git push origin hotfix-production-vX.X.X-(Y+1)`: this will soft deploy to `production` on Circle CI.
1. Track the CI job until it succeed then warn your PO to test the latest production version. If it fail: you can delete the local and remote created tag and redo. 
1. ⚠️ If you have not done it yet, **do not** forget to create a pull request from your branch to `master` to also includes your fix on `master` branch

> It is on purpose that we do not push the tag without the prefix as it will trigger a hard deploy.
> TODO: see with marion why we need a local tag 
> 
### Troubleshooting

If I don't see my codepush on staging/prod app:

- Check that you find it on AppCenter: https://appcenter.ms/orgs/pass-Culture/apps/PassCulture-<env></env:staging|prod>-<os:ios|android>/distribute/code-push

![Code push](./CodePushOnAppCenter.png)
