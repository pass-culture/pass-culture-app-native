---
title: MarketingBlockExclusivity
slug: /features/home/components/modules/marketing/marketingblockexclusivity.native.test.tsx/marketingblockexclusivity
---

# MarketingBlockExclusivity

## Introduction

Ce document détaille le comportement du composant `MarketingBlockExclusivity`. Ce composant est responsable de l'affichage d'informations spécifiques liées à des offres marketing, notamment la gestion de la date de publication et l'interaction utilisateur.

## Scénarios et Comportements

Voici les différents scénarios et les comportements attendus pour le composant :

### 1. Publication Date dans le Futur (PublicationDate est après aujourd'hui)

*   **Objectif :** Gérer l'affichage du composant en fonction de la date de publication future.
*   **Comportements :**
    *   Si `shouldDisplayPublicationDate` est `true`:
        *   Affiche un texte indiquant la date de publication.
    *   Si `shouldDisplayPublicationDate` est `false`:
        *   Affiche un texte générique.

### 2. Publication Date Aujourd'hui (PublicationDate est aujourd'hui)

*   **Objectif :** Cacher le bandeau d'informations "Coming Soon" si la date de publication est aujourd'hui.
*   **Comportement :**
    *   N'affiche pas le `bottomBanner` contenant les informations "Coming Soon".

### 3. Publication Date Hier (PublicationDate est hier)

*   **Objectif :** Cacher le bandeau d'informations "Coming Soon" si la date de publication est passée.
*   **Comportement :**
    *   N'affiche pas le `bottomBanner` contenant les informations "Coming Soon".

### 4. Interaction Utilisateur : Navigation et Log

*   **Objectif :** Gérer l'interaction utilisateur lors du clic sur le composant.
*   **Comportements :**
    *   Lors d'un clic sur le composant :
        *   Navigue vers l'offre associée.
        *   Log l'événement "consult offer".
