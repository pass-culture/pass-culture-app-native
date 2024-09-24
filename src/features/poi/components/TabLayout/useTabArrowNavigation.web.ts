import { useCallback, useEffect } from 'react'

import { TabProps } from 'features/venue/types'

export const useTabArrowNavigation = <TabKeyType extends string>({
  tabListRef,
  selectedTab,
  setSelectedTab,
  tabs,
}: TabProps<TabKeyType>) => {
  const eventListener = useCallback(
    // Keyboard navigation with the arrow keys though the tabs
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role#keyboard_interaction
    (event: KeyboardEvent) => {
      if (!tabListRef.current) return
      const htmlRef = tabListRef.current as unknown as HTMLElement

      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        const index = tabs.indexOf(selectedTab)
        const nextIndex =
          event.key === 'ArrowRight'
            ? (index + 1) % tabs.length
            : (index - 1 + tabs.length) % tabs.length // + length, to avoid -1%length -> -1 instead of 1

        const tabId = tabs[nextIndex]

        if (tabId) {
          setSelectedTab(tabId)

          htmlRef?.querySelector<HTMLElement>(`[role="tab"][id="${String(tabId)}"]`)?.focus()
        }
      }
    },
    [selectedTab, setSelectedTab, tabListRef, tabs]
  )

  useEffect(() => {
    if (!tabListRef.current) return
    const htmlRef = tabListRef.current as unknown as HTMLElement

    htmlRef.addEventListener('keydown', eventListener)
    return () => htmlRef.removeEventListener('keydown', eventListener)
  })
}
