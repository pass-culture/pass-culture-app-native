---
title: LoginFromProfileForBeneficiaryUser
slug: /loginfromprofileforbeneficiaryuser
---

# Connexion à l'application

Ce document décrit les étapes qu'un utilisateur suit pour se connecter à l'application.

## 1. Accéder à la page de connexion

*   L'utilisateur ouvre l'application et l'écran d'accueil s'affiche.
*   L'application vérifie la présence du bouton "Mon profil".
*   L'utilisateur appuie sur "Se connecter".

## 2. Saisie des identifiants de connexion

*   L'application affiche la page de connexion.
*   L'utilisateur appuie sur le champ "Entrée pour l’email".
*   L'application redirige l'utilisateur vers un autre parcours (InputEmail.yml, non détaillé ici).
*   L'utilisateur appuie sur le champ "Ton mot de passe".
*   L'utilisateur saisit son mot de passe.
*   L'utilisateur ferme le clavier.
*   L'utilisateur appuie sur "Se connecter".

## 3. Après la connexion

*   L'application peut afficher différents messages et fenêtres contextuelles en fonction de la configuration :
    *   **Si** une fenêtre "Non merci" apparaît (par exemple, une demande de suivi des thèmes), l'utilisateur appuie sur "Non merci".
    *   **Si** une fenêtre "Prends 1 minute" apparaît (par exemple, une demande de questionnaire), l'utilisateur appuie sur "Plus tard".
    *   **Si** une fenêtre "Partager l’appli" apparaît (par exemple, une demande de partage), l'utilisateur appuie sur "Non merci".
    *   **Si** une fenêtre native iOS de sauvegarde du mot de passe s'affiche, l'utilisateur appuie sur "Plus tard".
