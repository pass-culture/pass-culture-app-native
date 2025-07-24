# State management

## Zustand

### Simple store

```ts
import { createStore } from 'libs/store/createStore'

type State = {
  bears: number
}

const defaultState: State = { bears: 0 }

const setActions = (set: (payload: State) => void) => ({
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  removeBear: () => set((state) => ({ bears: state.bears - 1 })),
  setBears: (payload: number) => set({ bears: payload }),
})

const useCountBears = createStore<State, ReturnType<typeof setActions>>(
  'count-bears-store',
  defaultState,
  setActions
)

export const useBears = () => useCountBears((state) => state.bears)
export const useBearsActions = () => useCountBears((state) => state.actions)
```

The name `count-bears-store` is used to identify in the DevTools.

Then, in a component, you can use the store as a simple hook:

```tsx
const Component = () => {
  const { bears, addBear, removeBear, setBears } = useCountBears()

  return (
    <View>
      <Typo.Title1>{bears} bears</Typo.Title1>
      <Button onClick={addBear}>+</Button>
      <Button onClick={removeBear}>-</Button>
      <Button onClick={() => setBears(0)}>Reset</Button>
    </View>
  )
}
```

### Persist store

```ts
import { createStore } from 'libs/store/createStore'

type State = {
  bears: number
}

const defaultState: State = { bears: 0 }

const setActions = (set: (payload: State) => void) => ({
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  removeBear: () => set((state) => ({ bears: state.bears - 1 })),
  setBears: (payload: number) => set({ bears: payload }),
})

const useCountBears = createStore<State, ReturnType<typeof setActions>>(
  'count-bears-store',
  defaultState,
  setActions,
  { persist: true }
)

export const useBears = () => useCountBears((state) => state.bears)
export const useBearsActions = () => useCountBears((state) => state.actions)
```

The name `count-bears-store` is used to identify the store in the AsyncStore/LocalStorage and DevTools.

### Devtools

#### Native

After RN 0.76, you can simply press `j` in metro to access dev tools.

[Remote JS debugging was deprecated in 0.73](https://reactnative.dev/blog/2023/12/06/0.73-debugging-improvements-stable-symlinks#remote-javascript-debugging)

#### Web

To use the devtools in a web app, install the Redux DevTools extension in your browser.

Then, click on the extension icon and you'll see your state in the opened panel.
