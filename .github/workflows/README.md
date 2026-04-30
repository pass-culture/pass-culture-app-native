# Présentation de la CI

L'objectif de cette documentation est de présenter l'organisation de la CI/CD via github action sur ce repository.

## Description détaillée de dev_on_push_workflow_main.yml

Ce workflow est celui initialement lancé pour faire un déploiement en testing/staging/integration/production. Il fait appel à d'autres workflows avec en variable l'environnement souhaité:

![schéma main](/doc/ci-cd/github_action_workflows/dev_on_push_workflow_main.drawio.svg)

## Description détaillée de dev_on_workflow_environment_deploy.yml

Ce workflow est celui lancé à chaque merge sur la branche master et en cas de pause de tag, il permet notamment le soft et le hard deploy de l'application sur Android/Ios AppStore

![schéma deploy](/doc/ci-cd/github_action_workflows/dev_on_workflow_environment_deploy.drawio.svg)

## Description détaillée de dev_on_workflow_web_deploy.yml et dev_on_workflow_web_proxy_deploy.yml

Ces workflows sont utilisés pour déployer le web sur les buckets GCP, et le proxy si il a été modifié

![schéma deploy_web](/doc/ci-cd/github_action_workflows/dev_on_workflow_web_deploy.drawio.svg)
![schéma deploy_proxy](/doc/ci-cd/github_action_workflows/dev_on_workflow_web_proxy_deploy.drawio.svg)

## Liste des fichiers

| Nom du fichier                             | Type     | Trigger       | Liens vers les runs                                                                                                      |
| :----------------------------------------- | :------- | :------------ | :----------------------------------------------------------------------------------------------------------------------- | --- |
| dev_on_pull_request_title_checker.yml      | Helper   | Automatically |                                                                                                                          |
| dev_on_push_workflow_main.yml              | Workflow | Automatically | [runs](https://github.com/pass-culture/pass-culture-app-native/actions/workflows/dev_on_push_workflow_main.yml)          |     |
| dev_on_workflow_check_folder_change.yml    | Helper   | Automatically |                                                                                                                          |
| dev_on_workflow_chromatic.yml              | Helper   | Automatically | [runs](https://github.com/pass-culture/pass-culture-app-native/actions/workflows/dev_on_push_workflow_chromatic.yml)     |
| dev_on_workflow_environment_deploy.yml     | Helper   | Automatically |                                                                                                                          |
| dev_on_workflow_environment_ios_deploy.yml | Helper   | Automatically |                                                                                                                          |
| dev_on_workflow_install.yml                | Helper   | Automatically |                                                                                                                          |
| dev_on_workflow_linter_ts.yml              | Helper   | Automatically |                                                                                                                          |
| dev_on_workflow_tester.yml                 | Helper   | Automatically |                                                                                                                          |
| dev_on_workflow_update_jira_issues.yml     | Workflow | Automatically | [runs](https://github.com/pass-culture/pass-culture-app-native/actions/workflows/dev_on_workflow_update_jira_issues.yml) |
| dev_on_workflow_web_deploy.yml             | Helper   | Automatically |                                                                                                                          |
| dev_on_workflow_web_proxy_deploy.yml       | Helper   | Automatically |                                                                                                                          |


export APP_NATIVE_CI_SERVICE_ACCOUNT_EMAIL=app-native-ci-testing@pc-native-testing.iam.gserviceaccount.com
export PROJECT_ID=pc-native-testing
# Add ttl of 30 minutes to avoid having too many keys in the service account
gcloud iam service-accounts keys create temporary-sa-key.json \
    --iam-account=$APP_NATIVE_CI_SERVICE_ACCOUNT_EMAIL \
    --project=$PROJECT_ID