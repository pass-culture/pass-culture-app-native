import { createStore } from 'libs/store/createStore'

type State = {
  navigation: any
}

const defaultState: State = {
  navigation: {},
}

export const Logger = createStore({
  name: 'logger',
  defaultState,
  actions: (set) => ({
    log: (name) => {
      console.log(name)
    },
  }),
})
