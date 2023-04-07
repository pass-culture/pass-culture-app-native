# Présentation de la CI

L'objectif de cette documentation est de présenter l'organisation de la CI/CD via github action sur ce repository.

## Description détaillée de dev_on_push_workflow_main.yml

Ce workflow est celui initialement lancé pour faire un déploiement en testing/staging/integration/production. Il fait appel à d'autres workflows avec en variable l'environnement souhaité:

![schéma main](./doc/drawio/dev_on_push_workflow_main.drawio.svg)

## Description détaillée de dev_on_workflow_environment_deploy.yml

Ce workflow est celui lancé à chaque merge sur la branche master et en cas de pause de tag, il permet notament le soft et le hard deploy de l'application sur Android/Ios Appstore

![schéma deploy](./doc/drawio/dev_on_workflow_environment_deploy.drawio.svg)

## Description détaillée de dev_on_workflow_web_deploy.yml et dev_on_workflow_web_proxy_deploy.yml

Ces worflows sont utilisés pour déployer le web sur les buckets GCP, et le proxy si il a été modifié

![schéma deploy_web](./doc/drawio/dev_on_workflow_web_deploy.drawio.svg)
![schéma deploy_proxy](./doc/drawio/dev_on_workflow_web_proxy_deploy.drawio.svg)

## Liste des fichiers

| Nom du fichier                             | Type     | Trigger       | Liens vers les runs                                                                                                  |
| :----------------------------------------- | :------- | :------------ | :------------------------------------------------------------------------------------------------------------------- |
| dev_on_push_workflow_main.yml              | Workflow | Automatically | [runs](https://github.com/pass-culture/pass-culture-main/actions/workflows/dev_on_push_workflow_main.yml)            |
| dev_on_pull_request_reassure.yml           | Workflow | Automatically | [runs](https://github.com/pass-culture/pass-culture-app-native/actions/workflows/dev_on_pull_request_reassure.yml)   |
| dev_on_pull_request_title_checker.yml      | Helper   | Automatically |                                                                                                                      |
| dev_on_schedule_lighthouse.yml             | Workflow | Automatically | [runs](https://github.com/pass-culture/pass-culture-app-native/actions/workflows/dev_on_schedule_lighthouse.yml)     |
| dev_on_workflow_check_folder_change.yml    | Helper   | Automatically |                                                                                                                      |
| dev_on_workflow_chromatic.yml              | Helper   | Automatically | [runs](https://github.com/pass-culture/pass-culture-app-native/actions/workflows/dev_on_push_workflow_chromatic.yml) |
| dev_on_workflow_environment_deploy.yml     | Helper   | Automatically |                                                                                                                      |
| dev_on_workflow_environment_ios_deploy.yml | Helper   | Automatically |                                                                                                                      |
| dev_on_workflow_install.yml                | Helper   | Automatically |                                                                                                                      |
| dev_on_workflow_linter_ts.yml              | Helper   | Automatically |                                                                                                                      |
| dev_on_workflow_tester.yml                 | Helper   | Automatically |                                                                                                                      |
| dev_on_workflow_web_deploy.yml             | Helper   | Automatically |                                                                                                                      |
| dev_on_workflow_web_proxy_deploy.yml       | Helper   | Automatically |                                                                                                                      |
| e2e-android-app.yml                        | Workflow | Automatically | [runs](https://github.com/pass-culture/pass-culture-main/actions/workflows/e2e-android-app.yml)                      |
| e2e-android-browser.yml                    | Workflow | Automatically | [runs](https://github.com/pass-culture/pass-culture-main/actions/workflows/e2e-android-browser.yml)                  |
| e2e-browser.yml                            | Workflow | Automatically | [runs](https://github.com/pass-culture/pass-culture-main/actions/workflows/e2e-browser.yml)                          |
| e2e-ios-browser.yml                        | Workflow | Automatically | [runs](https://github.com/pass-culture/pass-culture-main/actions/workflows/e2e-ios-browser.yml)                      |
