# State management

## Zustand

### Simple store

```ts
import { create } from 'zustand'

type State = {
  bears: number
}
type Actions = {
  addBear: () => void
  removeBear: () => void
  setBears: (nb: number) => void
}

export const useCountBears = create<State & Actions>()(
  (set) => ({
    bears: 0,
    addBear: () => set((state) => ({ bears: state.bears + 1 })),
    removeBear: () => set((state) => ({ bears: state.bears - 1 })),
    setBears: (payload) => set({ bears: payload }),
  }),
)
```

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
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type State = {
  bears: number
}
type Actions = {
  addBear: () => void
  removeBear: () => void
}

export const useCountBears = create<State & Actions>()(
  persist(
    (set) => ({
      bears: 0,
      addBear: () => set((state) => ({ bears: state.bears + 1 })),
      removeBear: () => set((state) => ({ bears: state.bears - 1 })),
    }),
    { name: 'bear-store', storage: createJSONStorage(() => AsyncStorage) }
  )
)
```

`name: 'bear-store'` is optional, it's used to identify the store in the AsyncStore/LocalStorage.

### Devtools

To debug the store, you can use the `devtools` middleware:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

type State = {
  bears: number
}
type Actions = {
  addBear: () => void
  removeBear: () => void
}

export const useCountBears = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        addBear: () => set((state) => ({ bears: state.bears + 1 })),
        removeBear: () => set((state) => ({ bears: state.bears - 1 })),
      }),
      { name: 'bear-store', storage: createJSONStorage(() => AsyncStorage) }
    ),
    { enabled: process.env.NODE_ENV === 'development', name: 'bear-store' }
  )
)
```

#### Native

To use the devtools in a React Native app, you need to import `react-native-devsettings` in your `App.tsx`:

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
