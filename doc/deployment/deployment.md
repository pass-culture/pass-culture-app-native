# DEPLOY APP

## Pre-requisites

- Install hub

  ```bash
  brew install hub
  ```

- Check you have already a token here: https://github.com/settings/tokens
  If not create a new one that has at least repo scope checked

## Testing & Staging: Deploy to AppCenter

Download the apps:

- hyperurl.co/pc-testing
- hyperurl.co/pc-staging

Or https://appcenter.ms/orgs/pass-Culture/apps/passculture-<ENV:testing|staging>-<PLATFORM:ios|android>

### Soft deploy (Code Push)

Most of the time, on testing, you didn't change anything in the native code. If you changed only javascript code, deploy will be **automatic** on CircleCI (deploy-soft-testing job).
Then the build is faster as only the javascript code is published.

The download and installation of the modification will be automatic when you open the app.

- Troubleshoot:
  If you don't see your changes, try to check if the codepush was correctly downloaded. To do so go to "CheatCodes", and click on the "check update" button.
  3 possibilities:
  - it displays "no update found" you are up to date
  - it shows "New version available on AppCenter" you need to go to hyperurl.co/pc-<testing|staging>
  - it download the update and restart the app

### Hard deploy

#### Testing

If I modified native code, I need to hard deploy:

- `yarn trigger:testing:deploy`
  This will create a tag `testing_vX.X.X` and push it.
  CircleCI will detect the tag and launch the lanes `deploy-android-testing-hard` & `deploy-ios-testing-hard` (see `.circleci/config.yml` file)

#### Staging

We do it once a week at the end of an iteration.

When you want to deploy the current version of master in staging, you can run the following command:

- `yarn trigger:staging:deploy`
  The first time you will be asked about username and password.
  Username = your github username
  Password = your token (you created here https://github.com/settings/tokens with at least repo scope)

This will create a tag `vX.X.X` and push it.

And this will create 2 pull request from MES-X.X.X to `staging` branch and `master` branch.

- Merge the 2 PR when tests are green.

CircleCI will detect the merge on `staging` branch and launch the lanes `deploy-ios-staging` & `deploy-android-staging` (see `.circleci/config.yml` file)

## Production: Deploy to App Store / Google Play Store

### Deploy hard

To deploy to production:

- `git checkout staging`: because we want to deploy what have been tested by PO on staging env (last tag vX.X.X)

- `yarn trigger:production:deploy`
  And this will create a pull request from `staging` to `production` branch.
  CircleCI will detect the tag and launch the lane `deploy-android-production-hard` & `deploy-ios-production-hard` (see `.circleci/config.yml` file)

### Deploy CodePush

#### Stratégie

![img](./codepush-strategy.png)

#### How to

/!\ DO NOT DEPLOY CODEPUSH IOS & ANDROID SIMULTANEOUSLY

- `git checkout hotfix/vX.X.X` (X.X.X version currently in production)
- cherry-pick all fix commits
- git push
- wait for the CI to be green
- deploy:

  1. Android: `yarn trigger:production:codepush:android`

  2. When android finished only, IOS: `yarn trigger:production:codepush:ios`
