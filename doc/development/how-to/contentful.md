# Modop créer/modifier un content model sur Contentful

👉 Pré-requis : avoir les [accès contentful](https://app.contentful.com/spaces/2bg01iqy0isv/environments/testing/home). Si ce n’est pas le cas, demander à un admin d’être ajouté à l’organisation pass culture.

<br/>

## Sélectionner l’environnement à modifier
<br/>
  Dans le burger menu en haut à gauche choisir soit ‘testing’ soit ‘master’ en fonction des changements que vous voulez opérer :

- ‘testing’ est utilisé par les apps testing, staging et integration ;
- ‘master’ est utilisé par l’app de production.

L’environnement utilisé par chaque app est défini par la variable `CONTENTFUL_ENVIRONMENT` des fichiers `.env.*`.

<br/>

## Créer un nouveau content model
<br/>
💡 Un content model est une **structure de donnée** qui sera ensuite utilisée pour créer du contenu (différence entre ‘content model’ et ‘content’ sur l’interface contentful)

<br/>
  Dans l’onglet ‘Content Model’, cliquer sur ‘Add Content Type’ et créer votre nouvelle structure de donnée.

<br/>

## Modifier un content model existant
<br/>
  Dans l’onglet ‘Content Model’, sélectionner le content model à modifier et ajouter/supprimer/modifier les champs existants.

<br/>
🚨 Si vous supprimer des champs existants vous allez introduire un breaking change ! Pensez à avertir les PM.

<br/>

## Côté app

Si l’app consomme ce content model, mettre à jour ses types dans `src/libs/contentful/types.ts` et, si besoin, ses adapters dans `src/libs/contentful/adapters/`.
