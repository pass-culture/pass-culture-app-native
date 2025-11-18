# ⚙️ Deployment process

See [notion documentation][1] for more information.

We use 3 environments for the mobile application: `testing` > `staging` > `production`.

There are two types of deployments: **soft** and **hard**:

- a **soft** deployment is typically the most frequent scenario, occurring when only the JavaScript code has been modified.
- a **hard** deployment is only required if the native code has changed:
  - environment variable changed or added
  - new native library
  - new build step
  - ...

Deployments are triggered using tags and pushing them to the remote repository. The CI detects if the tag contains a certain keyword (for example `patch` or `prod-hard-deploy`) and starts the appropriate deployment.

## Testing

You can review & download the **testing** apps on AppCenter for [iOS][2] & [Android][3] of using this [url][4].

### ⚡️ Soft deploy (automatic)

Most of the time, when developing a feature, you probably didn't change the native code: if you changed only javascript code, the deployment to the testing application will be **automatic** on the **CI** (see [`deploy-soft-testing`](../../.github/workflows/dev_on_push_workflow_main.yml#L103) job).

Then the build is faster as only the javascript code is published. The download and installation of the modification will be automatic when you open the app.

### Hard deploy (manual)

If you modified native code, you need to hard deploy:

- `yarn trigger:testing:deploy`

This will bump the patch number, create a tag `testing/vX.X.X+1` and push it.
The **CI** will detect the tag and launch the lanes [`hard-deploy-android-testing`](../../.github/workflows/dev_on_push_workflow_main.yml#L133) & [`dhard-eploy-ios-testing`](../../.github/workflows/dev_on_push_workflow_main.yml#L143).

## Staging (MES)

You can review & download the **staging** apps on AppCenter for [iOS][5] & [Android][6] of using this [url][7].

### Hard deploy

Once a week we hard deploy a version of staging from a Jira automation. The version is tagged on a specific commit.

It will bump the `minor` version, create a tag `vX.X+1.X` and push it.

#### Troubleshooting

<details>
  <summary>Problem during MES automation</summary>

In case there is a problem with the automation when you want to deploy the new staging version from a specific commit you can manually trigger the [GithubAction][8] :

- Click the `Run workflow` button select the `master` branch and give the commit from which you want to create a version

This will bump the `minor` version, create a tag `vX.X+1.X` and push it.

</details>

### Patch staging with additional commits

Pull master to make sure you have all the commits you need to patch.
Checkout the tag you want to start from.

- `git checkout vX.X.X` or `git checkout patch/vX.X.X` if a patch has already been made
- list all commits you want to patch to your tag.
- run `git cherry-pick <commit-hash>` for all commits **in the order they were merged to `master`** to avoid conflicts.
- build and deploy the patch by running the following script: `trigger:staging:deploy:patch`

This will bump the `patch` version, create a tag `patch/vX.X.X+1` and push it.
The CI will detect the tag `patch/vX.X.X` and launch the lanes `deploy-ios-staging-hard` & `deploy-android-staging-hard` (see `.github/workflows/dev_on_push_workflow_main.yml` file).

## Production (MEP)

### Hard deploy (when MEP wanted, manual)

- Figure out which version (and then tag) you want to deploy. If you patched a version Staging, it could be `patch/v1.X.Y`
- `yarn trigger:production:deploy <tag>`

This will create a tag `prod-hard-deploy`. The CI will detect the tag and launch the job to deploy the production web version.
The builds for iOS and Android were already generated at the MES time and are available on the Google Play Console and App Store Connect interfaces.

[1]: https://www.notion.so/passcultureapp/Processus-d-ploiement-MES-MEP-App-Native-bc75cbf31d6146ee88c8c031eb14b655
[2]: https://appcenter.ms/orgs/pass-Culture/apps/passculture-testing-ios
[3]: https://appcenter.ms/orgs/pass-Culture/apps/passculture-testing-android
[4]: https://app.testing.passculture.team/accueil
[5]: https://appcenter.ms/orgs/pass-Culture/apps/passculture-staging-ios
[6]: https://appcenter.ms/orgs/pass-Culture/apps/passculture-staging-android
[7]: https://app.staging.passculture.team/accueil
[8]: https://github.com/pass-culture/pass-culture-app-native/actions/workflows/jira_create_and_push_staging_testing_deploy_tags.yml
