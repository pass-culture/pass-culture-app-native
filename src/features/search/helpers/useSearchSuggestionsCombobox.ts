import { useCallback } from 'react'
import { NativeSyntheticEvent, Platform, TextInputKeyPressEventData } from 'react-native'

import {
  searchSuggestionsAccessibilityStore,
  useActiveOptionId,
  useHasOptions,
} from 'features/search/store/searchSuggestionsAccessibility.store'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { TextInputProps } from 'ui/components/inputs/types'

type ComboboxInputProps = Pick<
  TextInputProps,
  | 'role'
  | 'aria-autocomplete'
  | 'aria-controls'
  | 'aria-expanded'
  | 'aria-activedescendant'
  | 'autoComplete'
  | 'onKeyPress'
>

type KeyPressEvent = NativeSyntheticEvent<
  TextInputKeyPressEventData & { isComposing?: boolean; keyCode?: number }
>

type Params = {
  suggestionsId?: string
  isOpen: boolean
  onOpen?: () => void
  onClose: () => void
}

type SearchSuggestionsCombobox = {
  inputProps: ComboboxInputProps
  onQueryChange: () => void
  resetActiveOption: () => void
}

const OPTION_SELECTOR = `[role="${AccessibilityRole.OPTION}"]`
const CARET_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'Home', 'End'])
const IME_PROCESSING_KEY_CODE = 229

const noop = () => undefined
const disabledCombobox: SearchSuggestionsCombobox = {
  inputProps: {},
  onQueryChange: noop,
  resetActiveOption: noop,
}

export const getSearchSuggestionsListboxId = (suggestionsId: string) => `${suggestionsId}-listbox`

const getOptionElements = (listboxId: string): HTMLElement[] => {
  const listbox = document.getElementById(listboxId)
  return listbox ? Array.from(listbox.querySelectorAll<HTMLElement>(OPTION_SELECTOR)) : []
}

const getNextOption = (
  options: HTMLElement[],
  activeOptionId: string | null,
  key: 'ArrowDown' | 'ArrowUp'
): HTMLElement | undefined => {
  const activeIndex = options.findIndex((option) => option.id === activeOptionId)
  if (key === 'ArrowDown') return options[(activeIndex + 1) % options.length]
  return options[activeIndex <= 0 ? options.length - 1 : activeIndex - 1]
}

export function useSearchSuggestionsCombobox({
  suggestionsId = '',
  isOpen,
  onOpen,
  onClose,
}: Params): SearchSuggestionsCombobox {
  const hasOptions = useHasOptions(suggestionsId)
  const activeOptionId = useActiveOptionId(suggestionsId)
  const listboxId = getSearchSuggestionsListboxId(suggestionsId)

  const setActiveOption = useCallback(
    (optionId: string | null) =>
      searchSuggestionsAccessibilityStore.actions.setActiveOption(suggestionsId, optionId),
    [suggestionsId]
  )

  const resetActiveOption = useCallback(() => setActiveOption(null), [setActiveOption])

  const onQueryChange = useCallback(() => {
    resetActiveOption()
    if (!isOpen) onOpen?.()
  }, [resetActiveOption, isOpen, onOpen])

  const onKeyPress = useCallback(
    (event: KeyPressEvent) => {
      const { key, isComposing, keyCode } = event.nativeEvent
      if (isComposing || keyCode === IME_PROCESSING_KEY_CODE) return

      if (key === 'ArrowDown' || key === 'ArrowUp') {
        event.preventDefault()
        if (!isOpen) {
          onOpen?.()
          return
        }
        const nextOption = getNextOption(getOptionElements(listboxId), activeOptionId, key)
        if (!nextOption) return
        setActiveOption(nextOption.id)
        nextOption.scrollIntoView({ block: 'nearest' })
        return
      }

      if (key === 'Enter') {
        const activeOption = activeOptionId ? document.getElementById(activeOptionId) : null
        if (!activeOption) return
        event.preventDefault()
        resetActiveOption()
        activeOption.click()
        return
      }

      if (key === 'Escape') {
        if (!isOpen) return
        event.preventDefault()
        resetActiveOption()
        onClose()
        return
      }

      if (CARET_KEYS.has(key)) resetActiveOption()
    },
    [isOpen, onOpen, onClose, listboxId, activeOptionId, setActiveOption, resetActiveOption]
  )

  if (Platform.OS !== 'web' || !suggestionsId) return disabledCombobox

  return {
    inputProps: {
      role: AccessibilityRole.COMBOBOX,
      'aria-autocomplete': 'list',
      'aria-controls': listboxId,
      'aria-expanded': isOpen && hasOptions,
      'aria-activedescendant': activeOptionId ?? undefined,
      autoComplete: 'off',
      onKeyPress,
    },
    onQueryChange,
    resetActiveOption,
  }
}
