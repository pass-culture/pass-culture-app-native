# Micro-animations : guidelines dev

> Guidelines génériques. Exemple d'implémentation : [AnimatedFavoriteIcon](../../../src/ui/components/AnimatedFavoriteIcon.tsx) (cœur du bouton favori).

Une micro-animation est une animation courte (< 1 s) déclenchée par une action de l'utilisateur sur un élément d'UI : pop d'une icône, rebond, coche, toggle, fondu, cassure…

## Quel outil choisir

| Besoin | Outil |
| --- | --- |
| Micro-interaction sur une icône existante (pop, rebond, fondu, cassure, rotation…) | **Reanimated + icônes SVG du DS** |
| Transition d'UI simple (apparition, déplacement, couleur) | **Reanimated** (`useAnimatedStyle`, `entering`/`exiting`, ou les animations CSS de Reanimated 4) |
| Illustration narrative riche (succès, onboarding, chargement illustré), morphing de tracés, particules | **Lottie** |

Tout le nécessaire est déjà dans le projet : `react-native-reanimated` (v4), `react-native-worklets`, `react-native-svg` et les icônes de `ui/svg/icons`.

Pourquoi pas Lottie pour les micro-animations :

- il faut un export designer à chaque retouche, et le JSON est illisible en review ;
- la couleur doit être patchée à l'exécution pour suivre le thème ([ThemedStyledLottieView](../../../src/ui/animations/ThemedStyledLottieView.tsx)) ;
- l'animation se pilote en _frames_, avec des contournements spécifiques au web ;
- le rendu n'est pas testable, car Lottie est mocké par une `View` vide en test.

Options écartées : les sprites (raster, pas de thème, poids), Skia (dépendance lourde, web via wasm), Rive (reste un asset designer).

## Le modèle : une timeline + des pistes de keyframes

On reprend le modèle d'After Effects / Figma, en TypeScript :

1. **Une horloge** : une shared value `elapsedTime` qui va de `0` à `duration` (ms) en linéaire.
2. **Des pistes** : chaque propriété animée est une liste de keyframes `{ at: ms, value }` (type `KeyframeTrack`).
3. **Une lecture** : dans `useAnimatedStyle`, `interpolateKeyframes(elapsedTime.value, piste)` donne la valeur à l'instant courant.

Le helper [interpolateKeyframes.ts](../../../src/shared/animations/interpolateKeyframes.ts) applique entre deux keyframes un easing `t² (3 − 2t)`. C'est exactement `cubic-bezier(0.33, 0, 0.67, 1)`, l'« Easy Ease » par défaut d'After Effects. Avant la première keyframe (ou après la dernière), la première (ou dernière) valeur est conservée.

Ce modèle plutôt que des `withSequence(withTiming(…))` imbriqués, parce que :

- les **données** de l'animation sont séparées du code, donc relisibles et modifiables avec un designer ;
- toutes les propriétés partagent **la même horloge**, donc leur synchronisation est garantie ;
- on transcrit directement une spec designer (ou un Lottie existant) sans la réinterpréter.

### Gabarit

```ts
// ui/animations/xxxKeyframes.ts : données pures, une piste par propriété
export const XXX_DURATION = 400

export const xxxKeyframes = {
  iconScale: [
    { at: 0, value: 1 },
    { at: 150, value: 1.3 },
    { at: 400, value: 1 },
  ],
  iconOpacity: [
    { at: 0, value: 0 },
    { at: 100, value: 1 },
  ],
} satisfies Record<string, KeyframeTrack>
```

```tsx
// Composant
const elapsedTime = useSharedValue(0)

useEffect(
  function playAnimation() {
    if (!isAnimating) return undefined
    elapsedTime.value = 0
    elapsedTime.value = withTiming(XXX_DURATION, { duration: XXX_DURATION, easing: Easing.linear })
    const timeout = setTimeout(onAnimationFinish, XXX_DURATION)
    return () => {
      clearTimeout(timeout)
      cancelAnimation(elapsedTime)
    }
  },
  [isAnimating, elapsedTime, onAnimationFinish]
)

const iconStyle = useAnimatedStyle(
  () => ({
    opacity: interpolateKeyframes(elapsedTime.value, xxxKeyframes.iconOpacity),
    transform: [{ scale: interpolateKeyframes(elapsedTime.value, xxxKeyframes.iconScale) }],
  }),
  [elapsedTime] // obligatoire pour le web, voir plus bas
)

return (
  <Animated.View style={iconStyle}>
    <MyIcon size={size} color={color} />
  </Animated.View>
)
```

## Règles

1. **Animer les icônes du DS, pas de nouveaux assets.** On enveloppe l'icône existante dans des `Animated.View`. Si une forme manque, on l'ajoute au DS comme un SVG classique.
2. **N'animer que `transform` et `opacity`** sur des `Animated.View`. C'est exécuté hors du thread JS, et le rendu est identique sur iOS, Android et web. On évite `useAnimatedProps` sur les props SVG (`Path`, etc.), moins fiable sur le web et plus coûteux.
3. **Une horloge par animation.** Pas de `withSequence` concurrents qui se désynchronisent.
4. **Couleurs = tokens du thème**, passés en props aux icônes. Jamais de couleur en dur.
5. **Point d'ancrage** : par défaut le centre de la vue. Utiliser `transformOrigin` (ex. `'bottom'`) en style **statique**.
6. **Un calque = un `Animated.View`** en `position: 'absolute'`, pour superposer et animer indépendamment plusieurs icônes (ex. un fondu enchaîné contour → plein).
7. **Durée** : 200 à 500 ms. Si l'élément est bloqué pendant l'animation (anti double tap), au-delà de 600 ms il faut en discuter avec le design.
8. **Storybook** : ajouter chaque micro-animation à la story `Fondations/Animations` ([Animations.stories.tsx](../../../src/ui/storybook/Animations.stories.tsx), `CodeAnimations`), où elle est jouée en boucle au survol. C'est le support de revue design.

## Technique : découper une icône en morceaux

Pour casser, ouvrir ou éclater une icône sans nouvel asset :

- exporter le tracé et le viewBox de l'icône depuis son fichier (`export const XXX_PATH`, `XXX_VIEWBOX`) ;
- rendre l'icône une fois par morceau, chaque copie découpée par un `ClipPath` SVG (`Defs` > `ClipPath` > `Polygon`). Le polygone est une donnée (liste de points dans le viewBox), à mettre à côté des keyframes ;
- animer chaque morceau via son `Animated.View` parent.

Attention :

- **Id de `ClipPath` unique par instance** : sur le web, les ids SVG sont globaux au document. Utiliser `useId()` en retirant les caractères non `[\w-]`, qui cassent `url(#id)`.
- **Liseré d'anti-aliasing** à la jointure : faire déborder légèrement chaque morceau sur la ligne de coupe (≈ 0,3 unité du viewBox). Hors animation, afficher l'icône entière.

## Pièges

- **Web : toujours passer les shared values lues dans les deps de `useAnimatedStyle`.** Le build web (Vite) n'utilise pas le plugin Babel `react-native-worklets/plugin`, donc Reanimated ne détecte pas les shared values lues dans le worklet. Sans elles en dépendances, le style n'est jamais recalculé et seul l'état final s'affiche. C'est la même convention que dans [CarouselDot](../../../src/ui/components/CarouselDot/CarouselDot.tsx).
- **Fin d'animation : un timer JS, pas le callback de `withTiming`.** En Jest, Reanimated est mocké : `withTiming` appelle son callback de façon synchrone et `withSequence` renvoie `0`. Un `setTimeout(onAnimationFinish, duration)` nettoyé dans le cleanup de l'effet rend la fin déterministe et testable.
- **Réduction des animations** : `withTiming` respecte la préférence système (`ReduceMotion.System`) et saute à l'état final. L'état final doit donc se suffire à lui-même.
- **Accessibilité** : l'état ne doit jamais être porté uniquement par l'animation (label, `accessibilityState`…).

## Tests

- Les **pistes et helpers** (fonctions pures) se testent en unitaire.
- Le **comportement** autour de l'animation (élément désactivé pendant l'animation, réactivé après) se teste avec les fake timers : `await act(() => jest.advanceTimersByTime(DURATION))`.
- Les **valeurs intermédiaires** ne se testent pas en unitaire (Reanimated est mocké). On les vérifie visuellement dans Storybook (`yarn storybook`), qui tourne sur le moteur web, et sur device.

## Checklist PR

- [ ] Spec designer reçue (durée, keyframes, points d'ancrage, easing, couleurs)
- [ ] Keyframes dans un fichier de données dédié, typées `KeyframeTrack`
- [ ] Uniquement `transform` / `opacity`, couleurs issues du thème
- [ ] Shared values dans les deps de chaque `useAnimatedStyle`
- [ ] Fin d'animation pilotée par un timer, testée avec les fake timers
- [ ] Ajoutée à la story `Fondations/Animations`
- [ ] Vérifié sur web, iOS et Android
