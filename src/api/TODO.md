Pas de ticket
Mobtime: https://mobtime.hadrienmp.fr/mob/pass-culture

TODO :

- [ ] Doc qui relie les versions des routes aux versions de l'app
  - [ ] Lors du déploiement front, regarder dans le code front les routes existantes
    - [x] prérequis: vérifier que la CI front empêche le code mort -> Pas dans le cas de gen/api.ts
    - [x] On veut récupérer cette info (version -> routes utilisées) à chaque pose de tag (MeS, MeP)
      - [ ] Soft (code push)
      - [ ] Hard (Nouvelle version)
    - [x] Besoin d'un dev front - merci @Bruno
    - [ ] Outil utile: [semgrep](https://semgrep.dev)
- [ ] Tester de marquer les tests comme dépréciés avec pytest_deprecated plugin
- [ ] Faisabilité d'ajouter des notes de deprecated
- [ ] commandes qui génèrent le code pour une nouvelle version
- [ ] commandes pour supprimer une route et ses tests
- [ ] Mettre en place mécanisme pour savoir qu'une version deprecated n'est plus utilisée
  - [ ] A la mise à jour forcée
- [ ] (Optionel?) Ecrire une commande flask qui retourne les routes par version
- [ ] Msw config à adapter aux /v2 et autres
  - src/tests/mswServer.ts
  - On fait "export const mockServer = new MswMockServer(`${env.API_BASE_URL}/native/v1`)" -> rendre le v1 dynamique -> voir avec Marine
