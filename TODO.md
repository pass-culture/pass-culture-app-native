# TODO

## Links

- [PC-23701](https://passculture.atlassian.net/browse/PC-23701)
- [MobTime](https://mobtime.hadrienmp.fr/mob/pass-culture)

---

## Tasks

- [x] ajouter le svg de la petite loupe -> [](https://www.figma.com/file/9vjOC2ygiCZroPl9FUF36s/Localisation?node-id=2770%3A77120&mode=dev)
- [x] Dans LocationModal, ajouter le 2e bouton “Choisir une localisation” :
  - [x] Au clic il devient rouge
  - [x] réutiliser le composant SearchInput
  - [x] placeholder : "Ville, code postal, adresse"
  - [x] éviter d'écrire en italique dans l'input
  - [x] s’inspirer de ce qui est fait dans l’actuelle LocationModal et dans SuggestedPlacesOrVenues
    - [x] notamment le message si l'adresse ne correspond à aucune localisation ( en cours) -> justifier à gauche
  - [x] quand une localisation est sélectionnée, on l’affiche en button text dans l’input
  - [/] changer les règles de validation du formulaire : si aucune adresse n'est sélectionne, le bouton est disabled
  - [x] Au clic sur “Choisir une localisation”, faire apparaître l’input de recherche
  - [x] remettre à 0 le nombre de caractères minimum pour lancer la recherche
  - [x] regarder / créer un ticket, pour cleaner l'icone Loupe : 16 px du bord à gauche (marge gauche de l'icone dans l'input paraît plus grande que dans la maquette -> garder comme l'existant)
  - [x] icon du pin est filled dans la maquette mais pas dans le code -> utiliser le nouvel écart dans la modale de la recherche de localisation
  - [x] marges entre input et sous titre à calibrer ( suppression marge vertical donc verif location button)
  - [x] Sauvegarder le nom de la position utilisateur dans le context ainsi que les coordonnées
  - [x] A l'affichage de la modale, remplir le champ input avec le nom de la postion utilisateur
  - [ ] renommer le Hit de SuggestedPlaces
  - [ ] mettre à jour le texte d'erreur
  - [ ] Fixer les erreurs de Typescript
  - [ ] Renommer les éléments

### Questions pour Agathe

- doit-on corriger l'espace entre la croix à droite de l'input et le texte entré ?
