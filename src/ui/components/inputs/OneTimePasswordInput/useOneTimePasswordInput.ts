import { useEffect, useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import { useStore } from 'zustand'

import {
  createOneTimePasswordStore,
  selectInvalidIndexes,
  selectValues,
} from 'ui/components/inputs/OneTimePasswordInput/oneTimePasswordStore'

type UseOneTimePasswordInputParams = {
  code: string[]
  numberOfInputs: number
  onCodeChange: (code: string[]) => void
}

export const useOneTimePasswordInput = ({
  code,
  numberOfInputs,
  onCodeChange,
}: UseOneTimePasswordInputParams) => {
  const [store] = useState(() => createOneTimePasswordStore(numberOfInputs, code))

  const inputRefs = useRef<Array<RNTextInput | null>>([])
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const values = useStore(store, selectValues)
  const invalidIndexes = useStore(store, selectInvalidIndexes)

  const syncValues = () => {
    store.getState().setValues(code)
  }

  useEffect(syncValues, [code, store])

  const focusInput = (index: number | null) => {
    if (index === null) {
      return
    }

    inputRefs.current[index]?.focus()
  }

  const setInputRef = (index: number, ref: RNTextInput | null) => {
    inputRefs.current[index] = ref
  }

  const handleChangeText = (inputValue: string, index: number) => {
    const nextFocusIndex = store.getState().setCharacter(index, inputValue)

    onCodeChange(store.getState().values)
    focusInput(nextFocusIndex)
  }

  const handleBackspace = (index: number) => {
    const previousFocusIndex = store.getState().backspace(index)

    onCodeChange(store.getState().values)
    focusInput(previousFocusIndex)
  }

  return {
    values,
    invalidIndexes,
    focusedIndex,
    setFocusedIndex,
    setInputRef,
    handleChangeText,
    handleBackspace,
  }
}
