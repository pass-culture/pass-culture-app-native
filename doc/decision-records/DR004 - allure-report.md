# DR004 - allure-report

> Statut : Adopté

⚠️ **MISE À JOUR** ⚠️

Nous avons décidé dans un premier temps de ne plus lancer Allure Report car nous n'avons jamais réussi a le faire fonctionner comme nous le voulions. Quelques mois plus tard, nous avons eu des erreurs dans la CI qui empechaient de déployer testing. Nous avons donc décidé de supprimer Allure Report.

## Contexte

L'équipe a peu de visibilité sur les tests et cela doit-être actuellement depuis l'historique de CI.

## Decision

Nous avons opté pour Allure report qui permet d'avoir une vue globale des tests et de leur santé sur une page dédiée hébergée sur Github pages.

## Strat tech

Tout est référencé dans les actions `dev_on_workflow_tester.yml`
La pipeline de tests est divisée en 10 shards (les jobs tournent simultanément pour plus de rapidité), 7 pour les tests natifs et 3 pour le web.
Un rapport sera créé pour chacun des shards
Chacun des job tourne sur une machine virtuelle différente, donc un nouveau job doit cloner (checkout) le repo, créer les node_modules, etc.
Les différents moyens de passer des fichiers d'un job à un autre est de créer un artefact, un cache sur Github (comme pour les node_modules), ou utiliser le service Google Cloud. On a décider d'utiliser Google Cloud à l'instar du job de coverage, qui est relativement similaire.
Les jobs de tests, qui créent les rapports Allure tournent donc sur 10 machines virtuelles différentes
Il faut dans un premier temps les uploader vers Google Cloud

```yaml
- name: Cache the allure reports
  if: github.ref == 'refs/heads/master'
  id: allure-report-cache-native
  uses: pass-culture-github-actions/gcs-cache@v1.0.0
  with:
    bucket: ${{ inputs.CACHE_BUCKET_NAME }}
    path: |
      allure-results-${{matrix.shard}}
    restore-keys: |
      v1-allure-dependency-cache-${{ runner.os }}-${{ github.sha }}-${{ matrix.shard }}
    key: v1-allure-dependency-cache-${{ runner.os }}-${{ github.sha }}-${{ matrix.shard }}
```

puis les décompresser en boucle (ils sont stockés au format `tar`), et tous les placer dans le dossier `allure-result` pour les merger

```yaml
- name: 'Retrieve reports from bucket'
  run: |
    mkdir allure-results
    gsutil cp 'gs://${{ inputs.CACHE_BUCKET_NAME }}/pass-culture/pass-culture-app-native/v1-allure-dependency-cache-${{ runner.os }}-${{ github.sha }}-*' allure-results
    gsutil cp 'gs://${{ inputs.CACHE_BUCKET_NAME }}/pass-culture/pass-culture-app-native/v1-allure-dependency-cache-web-${{ runner.os }}-${{ github.sha }}-*' allure-results
    for file in `ls allure-results/*tar`; do tar --use-compress-program='zstd --long=30' -xf $file; done
    rm -f allure-results/*.tar
    find . -maxdepth 1 -type d -name "allure-results-*" | while read dir; do
    cp -r "$dir"/* allure-results
    done
    rm -rf allure-results-*
```

Ainsi, on obtient un dossier `allure-results` comme si on avait fait tourner tous les tests sur un même job
On peut ensuite build le site web à partir du fichier `allure-results` grâce à la commande `yarn generate:allure-report`, et obtenir le dossier `allure-report`
Le contenu du dossier est ensuite envoyé sur la branche `allure-report`
La branche `allure-report` est configurée sur Github comme étant rattachée à Github pages, donc chaque push sur cette branche déploiera son contenu automatiquement.

Tout ceci est conditionné dans la CI par le fait que l'on pousse vers la branche `master`:

- la variable d'environnement `RUN_ALLURE` est `true`, donc les tests utilisent l'environnement `allure-report`

```ts
  // jest.config.js
  testEnvironment: process.env.RUN_ALLURE === 'true' ? 'allure-jest/node' : undefined,
```

```ts
  // jest.web.config.js
testEnvironment: process.env.RUN_ALLURE === 'true' ? 'allure-jest/jsdom' : 'jsdom',
```

- les steps qui sont utile que à la génération du rapport Allure sont conditionnés par `if: github.ref == 'refs/heads/master'`

Ainsi on ne crée pas de rapport Allure tant que le développeur n'a pas mergé sa PR

## Potentielles étapes suivantes

Conserver un historique des rapports, actuellement le rapport généré écrase le rapport précédent
