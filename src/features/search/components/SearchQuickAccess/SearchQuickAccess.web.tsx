import React, { useEffect, useRef } from 'react'

import { useSearch } from 'features/search/context/SearchWrapper'
import { QuickAccess } from 'ui/web/link/QuickAccess'

type SearchQuickAccessProps = {
  targetId: string
  title: string
}

export const SearchQuickAccess = ({ targetId, title }: SearchQuickAccessProps) => {
  const { isFocusOnSuggestions, hideSuggestions } = useSearch()
  const isTargetFocusPending = useRef(false)

  const focusTargetOnceMounted = () => {
    if (!isTargetFocusPending.current) return
    const target = document.getElementById(targetId)
    if (!target) return
    isTargetFocusPending.current = false
    target.focus()
  }

  useEffect(focusTargetOnceMounted, [focusTargetOnceMounted, isFocusOnSuggestions])

  const skipToTarget = () => {
    if (isFocusOnSuggestions) {
      isTargetFocusPending.current = true
      hideSuggestions()
      return
    }
    document.getElementById(targetId)?.focus()
  }

  return <QuickAccess href={`#${targetId}`} title={title} onClick={skipToTarget} />
}
