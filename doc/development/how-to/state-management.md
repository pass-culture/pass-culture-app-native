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
      <TypoDS.Title1>{bears} bears</TypoDS.Title1>
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

In order to use the devtools in a React Native app, we import `react-native-devsettings` in your `App.tsx` when in development mode:

```tsx
if (process.env.NODE_ENV === 'development') {
  import('react-native-devsettings')
}
```

Then, you can open React Native Debugger, shake your device and press `(*) Debug JS Remotely`.

Once React Native Debugger is connected, you'll see your state in the Redux DevTools section.

#### Web

To use the devtools in a web app, install the Redux DevTools extension in your browser.

Then, click on the extension icon and you'll see your state in the opened panel.
