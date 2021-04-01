# DEPLOY APP

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

- `yarn trigger:testing:deploy`
  This will create a tag `testing_vX.X.X` and push it.
  CircleCI will detect the tag and launch the lanes `deploy-android-testing-hard` & `deploy-ios-testing-hard` (see `.circleci/config.yml` file)

## Staging (MES)

Download the app:

- hyperurl.co/pc-staging
  or
- https://appcenter.ms/orgs/pass-Culture/apps/passculture-staging-<PLATFORM:ios|android>

### Hard deploy (once a week, manual)

When you want to deploy the current version of master in staging, you can run the following command:

- `yarn trigger:staging:deploy`

This will create a tag `vX.X.X` and push it.

CircleCI will detect the tag `vX.X.X` and launch the lanes `deploy-ios-staging-hard` & `deploy-android-staging-hard` (see `.circleci/config.yml` file)

## Production (MEP)

### Hard deploy (when MEP wanted, manual)

- Know which version (and then tag) you want to deploy

- `yarn trigger:production:deploy <tag>`

This will create a tag `prod-hard-deploy`
CircleCI will detect the tag and launch the lane `deploy-android-production-hard` & `deploy-ios-production-hard` (see `.circleci/config.yml` file)

## Hotfix

### When

Only if there is a bug really urgent in production, that we need to fix very quickly.

### How

- List all tags of the version `X.X.X`, tags of type: `vX.X.X-Y`
- Checkout on the tag with the biggest Y (if no tag with Y, checkout on `vX.X.X`)
- `git checkout -b hotfix/vX.X.X-Y`
- Code the fix
- Commit
- `git tag vX.X.X-(Y+1)`
- `git tag hotfix-staging-vX.X.X-(Y+1)`
- `git push origin hotfix-staging-vX.X.X-(Y+1)`: this will deploy it to `staging`
- Validate the fix with the PO on staging app (version X.X.X)
- If it is OK for the PO, deploy it to production:
- `git tag hotfix-production-vX.X.X-(Y+1)`
- `git push origin hotfix-production-vX.X.X-(Y+1)`: this will deploy it to `production`
- ⚠️ Do not forget to create a pull request from your branch to `master` to retrieve fixes on master branch

### Troubleshooting

If I don't see my codepush on staging/prod app:

- Check that you find it on AppCenter: https://appcenter.ms/orgs/pass-Culture/apps/PassCulture-<env></env:staging|prod>-<os:ios|android>/distribute/code-push

![img](./CodePushOnAppCenter.png)
