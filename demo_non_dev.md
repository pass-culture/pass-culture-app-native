---
title: Storybook / Chromatic
---

# Storybook / Chromatic

pour les devqapoux

---

## Actuellement

--

### Actuellement par les Zulux sur Figma

[Fondation](https://www.figma.com/file/jswn3bl2Sy7hm4XDyOLWE9/Fondations)

<iframe src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Fjswn3bl2Sy7hm4XDyOLWE9%2FFondations%3Fnode-id%3D25%253A0" allowfullscreen></iframe>

--

[Library Jeune](https://www.figma.com/file/r2DymT3uGbCrY2MZOtFYW3/App-Native---Library)

<iframe src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Fr2DymT3uGbCrY2MZOtFYW3%2FApp-Native---Library%3Fnode-id%3D1%253A2" allowfullscreen></iframe>

--

_[Library Pro](https://www.figma.com/file/AEXCkb4KbUyPmB4BRFa88s/PRO---Library)_

<iframe src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FAEXCkb4KbUyPmB4BRFa88s%2FPRO---Library%3Fnode-id%3D1%253A2" allowfullscreen></iframe>

--

### Actuellement Dev

[CheatCodes](https://app.testing.passculture.team/composants-app)

<iframe src="https://app.testing.passculture.team/composants-app"></iframe>

--

### Problèmes

* dev : difficile de créer un composant
* dev / po / zulux / qa : difficile de vérifier un composant et tout ces états
  * le rendu
  * le comportement
  * l'accéssibilité
* zulux / dev : déssynchronisés

---

## Storybook

---

### Phylosophie

[Component Driven](https://www.componentdriven.org)

* créer son composant de manière isolée
  * intégrer dans la page une fois finie
* vérifier le rendu, le comportement, l'a11y
* créer de manière à ce qu'il soit facile d'utilisation
* living documentation
* démo facile d'accès

--

* 1 composant
  * story =
    * montrer un état, un comportement
  * plusieurs stories pour montrer les différents états et comportements possibles

---

### Disclaimer

* setup minimalist
* peu de stories *(pour le moment)*
* pas expert

---

### Démos

[Storybook Jeune](https://master--61fd537ecf081f003a135235.chromatic.com)

--

* Sidebar
  * liste de composants
    * liste de stories
  * recherche

--

* Addons
  * Controls
    * props
    * reset
  * Actions
    * clear

--

* Canvas
  * composant intéractif
  * toolbar
    * viewport (téléphone)
    * mesure
    * zoom
    * background (dark-mode)
    * grille (16x16)
    * outline

<iframe src="https://master--61fd537ecf081f003a135235.chromatic.com"></iframe>

--

### Questions sur la démo ?

---

## Chromatic

* Outil en ligne par les devs de Storybook
* Review graphique lors des PR
* Tests de non-régression pixel perfect
* Storybook hébergé partagable

--

### Démo Chromatic

* [Démo storybook chromatic](https://www.chromatic.com/pullrequest?appId=61fd537ecf081f003a135235&number=2638)
* [Cas réel ombre](https://www.chromatic.com/pullrequest?appId=61fd537ecf081f003a135235&number=2606)

--

### Questions sur la démo ?

---

## La suite

* créer les nouveaux composants dans Storybook
* s'aligner avec ce qui existe dans Figma
* REX dans quelques semaines sur Chromatic pour les dev Pro ?

--

### Améliorer notre collaboration

Proposition :

  1. zulux : crée / change un composant dans Figma
  1. zulux / PO : signale ce changement dans l'US
  1. dev : crée / change le composant dans Storybook
  1. dev : fait le reste de l'US
  1. PO / zulux / QA : vérifie le rendu et le comportement dans Storybook
  1. PO / zulux / QA : vérifie le rendu et le comportement dans la page

---

## À mettre en favoris

* [Figma Fondation](https://www.figma.com/file/jswn3bl2Sy7hm4XDyOLWE9/Fondations)
* Jeune
  * [Figma Library Jeune](https://www.figma.com/file/r2DymT3uGbCrY2MZOtFYW3/App-Native---Library)
  * [Storybook Jeune](https://master--61fd537ecf081f003a135235.chromatic.com)
* Pro
  * [Figma Library Pro](https://www.figma.com/file/AEXCkb4KbUyPmB4BRFa88s/PRO---Library)
  * [Storybook Pro](https://pass-culture.github.io/pass-culture-main/)

---

## Quelles sont vos questions ?

---

## ROTI

1. j'ai perdu mon temps
2. 
3. 
4. je n'aurais pas pu mieux investir ce temps

### Feedbacks directs / MP plus tard

* qu'avez-vous aimé ?
* qu'avez-vous moins / pas aimé ?
* comment améliorer la prochaine fois ?

<style>
iframe {
    width: 800px;
    height: 450px;
}
</style>
