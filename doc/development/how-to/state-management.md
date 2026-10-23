# Gestion de l'état

## Zustand

Voir [DR011](../../decision-records/DR011%20%20S%C3%A9paration%20des%20%C3%A9tats%20%28Serveur%20vs%20Client%29.md) : Zustand est utilisé pour l'état côté client, et React Query pour l'état côté serveur.

### Store simple

Les stores sont créés à l'aide de `createStore` (`src/libs/store/createStore.ts`) :

```ts
import { createStore } from 'libs/store/createStore'

type State = {
bears: number
}

const defaultState: State = { bears: 0 }

const countBearsStore = createStore({
name: 'count-bears-store',
defaultState,
actions: (set) => ({
addBear: () => set((state) => ({ bears: state.bears + 1 })),
removeBear: () => set((state) => ({ bears: state.bears - 1 })),
setBears: (bears: number) => set({ bears }),
}),
selectors: {
selectBears: () => (state) => state.bears,
},
})

export const countBearsActions = countBearsStore.actions
export const { useBears } = countBearsStore.hooks
```

`createStore` renvoie `{ store, actions, selectors, hooks }` :

- `actions` : les actions, utilisables n'importe où (aucun hook requis).
- `selectors` : chaque sélecteur `select<Nom>`, appelé avec l'état actuel (par ex. `countBearsStore.selectors.selectBears()`), utilisable en dehors des composants.
- `hooks` : un hook `use<Nom>` généré pour chaque sélecteur `select<Nom>`, ainsi que `useStore`. Ensuite, dans un composant :

```tsx
const Component = () => {
const bears = useBears()
const { addBear, removeBear, setBears } = countBearsActions

return (
<View>
<Typo.Title1>{bears} ours</Typo.Title1>
<Button wording="+" onPress={addBear} />
<Button wording="-" onPress={removeBear} />
<Button wording="Réinitialiser" onPress={() => setBears(0)} />
</View>
)
}
```

### Persistance du store

```ts
const countBearsStore = createStore({
name: 'count-bears-store',
defaultState,
actions: (set) => ({
// ...
}),
selectors: {
// ...
},
options: { persist: true },
})
```

Le nom `count-bears-store` est utilisé comme clé dans `AsyncStorage` ou `LocalStorage`. Utilisez `options.persistKeys` pour ne persister que certaines clés de l'état.

### Outils de développement (Devtools)

#### React Native

Depuis la version 0.76 de React Native, il suffit d'appuyer sur la touche `j` dans Metro pour accéder aux outils de développement.

[Le débogage JavaScript distant (« Remote JS debugging ») a été abandonné depuis la version 0.73](https://reactnative.dev/blog/2023/12/06/0.73-debugging-improvements-stable-symlinks#remote-javascript-debugging)

#### Web

Le middleware `devtools` de Zustand est désactivé par défaut dans `createStore` (`enabled: false`) : les stores n'apparaissent donc pas dans l'extension Redux DevTools. Définissez `enabled: true` localement pour les inspecter (veillez à ne pas inclure cette modification dans vos commits).
