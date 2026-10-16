# State management

## Zustand

See [DR011](../../decision-records/DR011%20%20S%C3%A9paration%20des%20%C3%A9tats%20%28Serveur%20vs%20Client%29.md): Zustand is used for client state, React Query for server state.

### Simple store

Stores are created with `createStore` (`src/libs/store/createStore.ts`):

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

`createStore` returns `{ store, actions, selectors, hooks }`:

- `actions`: the actions, usable anywhere (no hook needed).
- `selectors`: each `select<Name>` selector, called with the current state (e.g. `countBearsStore.selectors.selectBears()`), usable outside components.
- `hooks`: a `use<Name>` hook generated for each `select<Name>` selector, plus `useStore`.

Then, in a component:

```tsx
const Component = () => {
  const bears = useBears()
  const { addBear, removeBear, setBears } = countBearsActions

  return (
    <View>
      <Typo.Title1>{bears} bears</Typo.Title1>
      <Button wording="+" onPress={addBear} />
      <Button wording="-" onPress={removeBear} />
      <Button wording="Reset" onPress={() => setBears(0)} />
    </View>
  )
}
```

### Persist store

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

The name `count-bears-store` is used as the key in the AsyncStorage/LocalStorage. Use `options.persistKeys` to persist only some keys of the state.

### Devtools

#### Native

After RN 0.76, you can simply press `j` in metro to access dev tools.

[Remote JS debugging was deprecated in 0.73](https://reactnative.dev/blog/2023/12/06/0.73-debugging-improvements-stable-symlinks#remote-javascript-debugging)

#### Web

The Zustand `devtools` middleware is disabled in `createStore` (`enabled: false`): stores do not appear in the Redux DevTools extension. Set `enabled: true` locally to inspect them (do not commit it).
