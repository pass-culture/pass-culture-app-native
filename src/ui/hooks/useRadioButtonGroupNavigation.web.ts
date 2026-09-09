import { useCallback, useEffect, useRef } from 'react'
import { FlatListProps } from 'react-native'

import {
  RadioButtonGroupNavigation,
  RadioButtonGroupNavigationParams,
  RadioButtonGroupOption,
} from 'ui/designSystem/RadioButtonGroup/types'

type PendingFocus = { key: string; select: boolean }

const arrowDirections: Record<string, number> = {
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -1,
}

export const useRadioButtonGroupNavigation = ({
  containerRef,
  listRef,
  options,
  value,
  disabled,
  onChange,
  id,
}: RadioButtonGroupNavigationParams): RadioButtonGroupNavigation => {
  const pendingFocus = useRef<PendingFocus | null>(null)
  const scrollAttempts = useRef(0)
  const highestMeasuredIndex = useRef(-1)
  const retryTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const enabledOptions = disabled ? [] : options.filter((option) => !option.disabled)
  const entryOption = enabledOptions.find((option) => option.label === value) ?? enabledOptions[0]
  const entryKey = entryOption?.key
  const getRadioId = useCallback((key: string) => `${id}-${encodeURIComponent(key)}`, [id])

  const getRadioProps = useCallback(
    (key: string) => ({
      id: getRadioId(key),
      tabIndex: key === entryKey ? (0 as const) : (-1 as const),
    }),
    [entryKey, getRadioId]
  )

  const onScrollToIndexFailed: FlatListProps<RadioButtonGroupOption>['onScrollToIndexFailed'] =
    useCallback(
      ({ index, averageItemLength, highestMeasuredFrameIndex }) => {
        if (!pendingFocus.current) return
        // FlatList can extend its measured range over several scrolls. Only
        // bound retries that do not advance toward the pending option.
        if (highestMeasuredFrameIndex > highestMeasuredIndex.current) {
          highestMeasuredIndex.current = highestMeasuredFrameIndex
          scrollAttempts.current = 0
        } else {
          scrollAttempts.current += 1
        }
        if (scrollAttempts.current >= 3) return
        listRef.current?.scrollToOffset({ offset: index * averageItemLength, animated: false })
        clearTimeout(retryTimer.current)
        retryTimer.current = setTimeout(() => {
          if (pendingFocus.current) {
            listRef.current?.scrollToIndex({ index, animated: false })
          }
        }, 100)
      },
      [listRef]
    )

  useEffect(
    function manageRadioGroupFocus() {
      const container = containerRef.current as unknown as HTMLElement | null
      if (!container) return

      const available = disabled ? [] : options.filter((option) => !option.disabled)
      const getRadios = () =>
        Array.from(container.querySelectorAll<HTMLElement>('[role="radio"]')).filter(
          (radio) => radio.closest('[role="radiogroup"]') === container
        )
      const getRadio = (key: string) => getRadios().find((radio) => radio.id === getRadioId(key))
      const getOption = (target: EventTarget | null) => {
        if (!(target instanceof HTMLElement) || target.closest('[role="radiogroup"]') !== container)
          return
        return available.find((option) => target.id === getRadioId(option.key))
      }

      const syncTabStops = () => {
        const focusedOption = getOption(document.activeElement)
        const key = focusedOption?.key ?? entryKey
        const target = key === undefined ? undefined : getRadio(key)
        getRadios().forEach((radio) => {
          radio.tabIndex = radio === target ? 0 : -1
        })
        // A virtualized selection may not be mounted yet. The group temporarily
        // provides the entry point and forwards focus once that radio is rendered.
        container.tabIndex = available.length > 0 && !target ? 0 : -1
      }

      const completePendingFocus = () => {
        const pending = pendingFocus.current
        if (!pending) return true
        const option = available.find((item) => item.key === pending.key)
        if (!option) {
          pendingFocus.current = null
          return true
        }
        const radio = getRadio(option.key)
        if (!radio) return false
        pendingFocus.current = null
        clearTimeout(retryTimer.current)
        radio.focus()
        if (pending.select && option.label !== value) onChange(option.label)
        return true
      }

      const focusOption = (key: string, select: boolean) => {
        pendingFocus.current = { key, select }
        scrollAttempts.current = 0
        highestMeasuredIndex.current = -1
        if (!completePendingFocus()) {
          const index = options.findIndex((option) => option.key === key)
          listRef.current?.scrollToIndex({ index, animated: false })
        }
        syncTabStops()
      }

      const onKeyDown = (event: KeyboardEvent) => {
        const option = getOption(event.target)
        if (!option) return
        const direction = arrowDirections[event.key]
        if (!direction) return
        event.preventDefault()
        event.stopPropagation()
        const index = available.indexOf(option)
        const nextOption = available[(index + direction + available.length) % available.length]
        if (nextOption) focusOption(nextOption.key, true)
      }

      const onFocus = (event: FocusEvent) => {
        if (event.target !== container) {
          pendingFocus.current = null
          clearTimeout(retryTimer.current)
        }
        if (event.target === container && entryKey !== undefined) {
          focusOption(entryKey, false)
        }
        syncTabStops()
      }
      const onBlur = (event: FocusEvent) => {
        if (!container.contains(event.relatedTarget as Node | null)) {
          pendingFocus.current = null
          clearTimeout(retryTimer.current)
          // focusout fires before document.activeElement reflects the new target.
          getRadios().forEach((radio) => {
            radio.tabIndex = entryKey !== undefined && radio.id === getRadioId(entryKey) ? 0 : -1
          })
          container.tabIndex = entryKey !== undefined && !getRadio(entryKey) ? 0 : -1
        }
      }
      const observer = new MutationObserver(() => {
        completePendingFocus()
        syncTabStops()
      })
      observer.observe(container, { childList: true, subtree: true })
      container.addEventListener('keydown', onKeyDown)
      container.addEventListener('focusin', onFocus)
      container.addEventListener('focusout', onBlur)
      completePendingFocus()
      syncTabStops()

      return () => {
        observer.disconnect()
        container.removeEventListener('keydown', onKeyDown)
        container.removeEventListener('focusin', onFocus)
        container.removeEventListener('focusout', onBlur)
        clearTimeout(retryTimer.current)
      }
    },
    [containerRef, disabled, entryKey, getRadioId, listRef, onChange, options, value]
  )

  return { getRadioProps, onScrollToIndexFailed }
}
