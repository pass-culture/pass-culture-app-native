import { createStore } from 'zustand/vanilla'

type OneTimePasswordState = {
  values: string[]
  setCharacter: (index: number, value: string) => number | null
  paste: (value: string) => number | null
  backspace: (index: number) => number | null
  setValues: (nextValues: string[]) => void
}

export const createOneTimePasswordStore = (
  numberOfInputs: number,
  initialValues: string[] = []
) => {
  const initialValuesForInputs = Array.from(
    { length: numberOfInputs },
    (_, index) => initialValues[index] ?? ''
  )

  return createStore<OneTimePasswordState>((set, get) => ({
    values: initialValuesForInputs,

    setCharacter: (index, value) => {
      const normalizedValue = value.toUpperCase()

      if (!normalizedValue) return null

      if (normalizedValue.length > 1) return get().paste(normalizedValue)

      set((state) => {
        const nextValues = [...state.values]
        nextValues[index] = normalizedValue
        return { values: nextValues }
      })

      return (index + 1) % numberOfInputs
    },

    paste: (value) => {
      const characters = value.toUpperCase().slice(0, numberOfInputs).split('')

      const nextValues = Array.from(
        { length: numberOfInputs },
        (_, index) => characters[index] ?? ''
      )

      set({ values: nextValues })

      if (characters.length === 0) return null

      return characters.length - 1
    },

    backspace: (index) => {
      const currentValues = get().values

      if (currentValues[index]) {
        const nextValues = [...currentValues]
        nextValues[index] = ''
        set({ values: nextValues })
        return null
      }

      if (index === 0) return null

      const previousIndex = index - 1
      const nextValues = [...currentValues]
      nextValues[previousIndex] = ''

      set({ values: nextValues })

      return previousIndex
    },

    setValues: (nextValues) => {
      set({ values: Array.from({ length: numberOfInputs }, (_, index) => nextValues[index] ?? '') })
    },
  }))
}

export const selectValues = (state: OneTimePasswordState) => state.values

export const selectInvalidIndexes = (state: OneTimePasswordState) =>
  state.values.reduce<number[]>((indexes, value, index) => {
    if (value !== '' && !/^\d$/.test(value)) indexes.push(index)
    return indexes
  }, [])
