# Analyse Jira - Release v1.368

**Date de création:** 28 novembre 2025
**Nombre de tickets:** 41
**Version:** AN-368 (App Native 368)
**Branch:** jira-368

---

## 📊 STATISTIQUES GLOBALES

### Vue d'ensemble
- **Total de tickets:** 41
- **Tickets visibles:** 41 (100%)
- **Tickets invisibles:** 0 (0%)

### Par type
- **Story:** 23 tickets (56.1%)
- **Tech Task:** 9 tickets (22.0%)
- **Bug:** 8 tickets (19.5%)
- **Tracking Task:** 1 ticket (2.4%)

### Par priorité
- **Majeur:** 31 tickets (75.6%)
- **Mineur:** 10 tickets (24.4%)

### Par équipe
- **JEUNES - Activation:** 17 tickets (41.5%)
- **JEUNES - Découverte:** 11 tickets (26.8%)
- **JEUNES - Conversion:** 9 tickets (22.0%)
- **INTERNE - Interne:** 1 ticket (2.4%)
- **Sans équipe:** 3 tickets (7.3%)

### Par catégorie
- **Nouvelles fonctionnalités:** 28 tickets
- **Accessibilité (RGAA):** 5 tickets
- **Bugs:** 8 tickets
- **Bugs critiques:** 0 ticket

---

## ✅ TICKETS VISIBLES - NOUVELLES FONCTIONNALITÉS (28 tickets)

### Design System & Composants UI

1. [PC-37009](https://passculture.atlassian.net/browse/PC-37009) - Création & implémentation RadioButton group
2. [PC-38136](https://passculture.atlassian.net/browse/PC-38136) - Variantes écran d'erreur
3. [PC-38681](https://passculture.atlassian.net/browse/PC-38681) - Implémentation Search Input
4. [PC-38920](https://passculture.atlassian.net/browse/PC-38920) - RadioButtonGroup retours UI

### Navigation & Performance

5. [PC-38159](https://passculture.atlassian.net/browse/PC-38159) - Migration Stack Navigators vers Native Stack 🔴
6. [PC-38166](https://passculture.atlassian.net/browse/PC-38166) - Optimisation animations avec useNativeDriver ⚡

### Recherche & Découverte

7. [PC-38145](https://passculture.atlassian.net/browse/PC-38145) - Recherche page partenaire: ajouter 'voir tout'
8. [PC-38560](https://passculture.atlassian.net/browse/PC-38560) - New Header SearchResults - Adapter search input
9. [PC-38567](https://passculture.atlassian.net/browse/PC-38567) - New SearchResults Header - Bouton Localisation
10. [PC-38583](https://passculture.atlassian.net/browse/PC-38583) - Accès page artiste avec une seule œuvre

### Réservations

11. [PC-37940](https://passculture.atlassian.net/browse/PC-37940) - Nouvelles routes bookings ended/ongoing 🔴

### Bonification

12. [PC-38487](https://passculture.atlassian.net/browse/PC-38487) - Bonification Banner dynamique selon statut
13. [PC-38671](https://passculture.atlassian.net/browse/PC-38671) - Ajout de nouveaux prénoms
14. [PC-38793](https://passculture.atlassian.net/browse/PC-38793) - Ville de naissance - recherche par nom
15. [PC-38851](https://passculture.atlassian.net/browse/PC-38851) - Lieu de naissance - 20 communes dans la liste

### Infrastructure & CI/CD

16. [PC-38800](https://passculture.atlassian.net/browse/PC-38800) - Bandeau message technique désactivable 🆕
17. [PC-38795](https://passculture.atlassian.net/browse/PC-38795) - Bump Sentry 6.22.0
18. [PC-38830](https://passculture.atlassian.net/browse/PC-38830) - Sign iOS build on simulator
19. [PC-38833](https://passculture.atlassian.net/browse/PC-38833) - Mesure de perf CI - fix job
20. [PC-38861](https://passculture.atlassian.net/browse/PC-38861) - Remove react-native-code-push
21. [PC-38870](https://passculture.atlassian.net/browse/PC-38870) - Respecter règles REACT part 2

### Tests E2E

22. [PC-38119](https://passculture.atlassian.net/browse/PC-38119) - Test flaky VenueMap
23. [PC-38744](https://passculture.atlassian.net/browse/PC-38744) - Script catch régressions UI avec IA
24. [PC-38745](https://passculture.atlassian.net/browse/PC-38745) - E2E Maintenance v1.366.0
25. [PC-38806](https://passculture.atlassian.net/browse/PC-38806) - E2E Update scripts booking et venueMap

### Autres

26. [PC-37698](https://passculture.atlassian.net/browse/PC-37698) - Doublons event ConsultOffer même timestamp
27. [PC-38815](https://passculture.atlassian.net/browse/PC-38815) - Supprimer champ isVirtual
28. [PC-38937](https://passculture.atlassian.net/browse/PC-38937) - Démarches Simplifiées → Démarche Numérique ; changement URL

---

## ♿ TICKETS ACCESSIBILITÉ - CRITÈRES RGAA (5 tickets)

29. [PC-37495](https://passculture.atlassian.net/browse/PC-37495) - Critère 9.11 - Formulaires modifiant/supprimant données
30. [PC-38648](https://passculture.atlassian.net/browse/PC-38648) - RETOURS - Critère 7.2 - Listes correctement structurées
31. [PC-38650](https://passculture.atlassian.net/browse/PC-38650) - RETOURS - Critère 11.9 - Contenu consultable (portrait/paysage) Partie 1
32. [PC-38849](https://passculture.atlassian.net/browse/PC-38849) - RETOURS - Critère 11.9 - Contenu consultable (portrait/paysage) Partie 2
33. [PC-38968](https://passculture.atlassian.net/browse/PC-38968) - RETOURS - Critère 11.9 - Contenu consultable (portrait/paysage) Partie 3

---

## 🐛 TICKETS BUGS (8 tickets)

34. [PC-38728](https://passculture.atlassian.net/browse/PC-38728) - Tokens design pas mis à jour Dark/Light mode home 🔴
35. [PC-38807](https://passculture.atlassian.net/browse/PC-38807) - Création compte - Modifier URL FAQ
36. [PC-38823](https://passculture.atlassian.net/browse/PC-38823) - Réservation offre datée - mauvaise gestion bouton back
37. [PC-38827](https://passculture.atlassian.net/browse/PC-38827) - Boutons réseaux sociaux ne fonctionnent pas iOS 26
38. [PC-38858](https://passculture.atlassian.net/browse/PC-38858) - Problèmes visuels modale
39. [PC-38859](https://passculture.atlassian.net/browse/PC-38859) - Modale sauvegarde non affichée & page confidentialité inaccessible
40. [PC-38866](https://passculture.atlassian.net/browse/PC-38866) - Erreur affichage itinéraire vers lieu
41. [PC-38921](https://passculture.atlassian.net/browse/PC-38921) - Incohérence adresse/redirection bouton "Lieu événement"

---

## 🔥 TICKETS CRITIQUES IDENTIFIÉS

### 🔴 Priorité HAUTE - Impact majeur

#### 1. PC-38159 - Migration Stack Navigators
**Type:** Story - JEUNES - Découverte
**Impact:** Migration complète de toute la navigation vers Native Stack
**Risque:** 56 fichiers modifiés, animations custom supprimées, comportements modaux changés
**Action requise:** Tests approfondis iOS/Android de tous les flows modaux

#### 2. PC-37940 - Nouvelles routes bookings v2
**Type:** Tech Task - JEUNES - Conversion
**Impact:** Migration API v2 avec feature flag WIP_NEW_BOOKINGS_ENDED_ONGOING
**Risque:** Double implémentation, conversions données complexes, mapping fields modifiés
**Action requise:** Tests end-to-end bookings avec flag ON/OFF, validation mapping données

#### 3. PC-38728 - Bug tokens Dark mode
**Type:** Bug - JEUNES - Découverte
**Impact:** Fix remount forcé des tabs au changement colorScheme
**Risque:** Perte potentielle d'état utilisateur non persisté lors switch dark/light
**Action requise:** Tests basculement dark/light pendant navigation active

---

## 📈 ANALYSE PAR EPIC

### Top 5 Epics les plus représentés

1. **Bonification** - 4 tickets
2. **Audit Access42 et augmentation note RAAM** - 4 tickets
3. **Amélioration Tests E2E Mobiles (T4 2025)** - 3 tickets
4. **Design system** - 2 tickets (incluant RadioButton)
5. **T4 - Migration Navigation Stack → Native Stack** - 3 tickets (PC-38159, PC-38858, PC-38859)

### Epics techniques importants

- **MàJ React Native** - 2 tickets (Sentry bump, remove code-push)
- **Nouvelle page de résultats** - 2 tickets (Header, Search Input)
- **T4 - Optimisation Animations Natives** - 1 ticket (PC-38166)
- **Mes réservations** - 1 ticket (PC-37940)
- **Mode Sombre** - 1 ticket (PC-38728)

---

## 🎯 RÉPARTITION PAR SPRINT

- **Itération 367** - 27 tickets (itération principale)
- **Itération 368** - 16 tickets
- **Itération 366** - 9 tickets
- **Itération 365** - 9 tickets
- **Itération 364** - 6 tickets
- Sprints antérieurs (358-363) - Quelques tickets traînants

---

## 🔗 LIENS UTILES

- **Jira Board:** https://passculture.atlassian.net/
- **Repository:** pass-culture-app-native
- **Branch:** jira-368
- **Main branch:** master
- **PRs associés:** 41 PRs mergées

---

## 📝 MÉTHODOLOGIE

### Sources de données
- Export Jira XML : 41 tickets
- Analyse commits git : 41 commits identifiés
- Code source : Analyse complète des PRs et fichiers modifiés

### Méthodes utilisées
1. **Analyse quantitative** : Comptage et classification des tickets
2. **Analyse qualitative** : Lecture du code source et des commits
3. **Identification des effets de bord** : Revue des fichiers modifiés et dépendances
4. **Vérification croisée** : Jira + Git log + Code source

---

**Prochaines étapes recommandées:**

1. ✅ Revue de ce dossier par l'équipe
2. ⏳ Exécution du plan de test complet
3. ⏳ Tests approfondis migration Native Stack (PC-38159)
4. ⏳ Validation routes bookings v2 avec feature flag (PC-37940)
5. ⏳ Tests Dark mode avec remount tabs (PC-38728)
6. ⏳ Déploiement et monitoring

---

*Documentation générée le 28 novembre 2025 par Claude Code*
