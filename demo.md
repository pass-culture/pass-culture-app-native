---
title: Storybook / Chromatic
---

# Storybook / Chromatic

---

## Storybook

---

### Disclaimer

* setup minimalist
* pas expert

---

### Phylosophie

[Component Driven](https://www.componentdriven.org)

* écrire son composant de manière isolée
  * intégrer dans la page une fois finie
* vérifier le rendu, le comportement, l'a11y
* faire une API (aka `props`) facile d'utilisation
* living documentation
* démo facile d'accès

--

* 1 story =
  * montrer un état, un comportement
* plusieurs stories pour montrer les différents états et comportements possibles
  * montrer des cas intéresssants
    * ne pas faire toutes les combinaisons possibles

---

### Démos

--

### Démo Canvas

* jouer avec les `props`
* `+` dans la démo avec les devqapoux

--

#### Démo Docs

* `props` documentées
* `Show code` C/C

---

### Comment écrire une story ?

* [la doc officielle](https://storybook.js.org/docs/react/writing-stories/introduction)
* `MonComposant.stories.tsx` à coté du fichier `MonComposant.tsx`
* dupliquer un `.stories.tsx` existant

--

```js
export default {
    title: 'arborescance',
}
```

* obligatoire
* arborescance du `title` != arborescance du FS

--

```js
export const Default = Template.bind({})
```

crée un état par `story` = évite les bugs

--

```js
<MachinProvider>
```

possiblement manquants _(setup minimalist)_

---

## Chromatic

* Outil SaaS par les devs de Storybook
* Review graphique lors des PR
* Tests de non-régression pixel perfect
* Storybook hébergé partagable (démo avec devqapoux)

--

### Démo Chromatic

* [Démo storybook chromatic](https://www.chromatic.com/pullrequest?appId=61fd537ecf081f003a135235&number=2638)
* [Cas réel ombre](https://www.chromatic.com/pullrequest?appId=61fd537ecf081f003a135235&number=2606)

---

## La suite organisationnelle

* démo avec devqapoux
* sessions de Pair Programming avec tout les devs volontaires
  * Storybookifier un composant qui est dans les cheatcodes
  * pour apprendre à écrire des stories par soit meme

--

## La suite technique

* [plein d'addons](https://storybook.js.org/addons/) intéressants, ex:
  * [:pseudo-states](https://storybook.js.org/addons/storybook-addon-pseudo-states) story pour `:hover`, `:focus`, `:active` ...
  * [Mobile UX Hints](https://storybook.js.org/addons/storybook-mobile)
  * [Design](https://storybook.js.org/addons/storybook-addon-designs/) intégration / preview de Figma
* [plopifier](https://plopjs.com/) la création des `.stories.tsx` ?
* [PC-13119](https://passculture.atlassian.net/browse/PC-13119) Mise en place d'un catalogue de composants UI Natif ?

---

## Quelles sont vos questions ?

---

## ROTI

1. j'ai perdu mon temps
2. 
3. 
4. j'aurais pas pu mieux investir ce temps

### Feedbacks directs / MP plus tard

* qu'avez-vous aimé ?
* qu'avez-vous moins / pas aimé ?
* comment améliorer la prochaine fois ?
