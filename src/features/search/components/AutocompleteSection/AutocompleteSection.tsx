import { SendEventForHits } from 'instantsearch.js/es/lib/utils'
import { isEqual } from 'lodash'
import React, { useEffect, useRef } from 'react'
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch-core'
import { styled } from 'styled-components/native'

import { SuggestionsSnapshot } from 'features/search/context/SearchSuggestionsAccessibilityProvider'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

type Props<T> = {
  title: string
  renderItem: (hit: T, sendEvent: SendEventForHits) => React.ReactNode
  onSuggestionsChange?: (snapshot: SuggestionsSnapshot) => void
} & UseInfiniteHitsProps

export function AutocompleteSection<T>({
  title,
  renderItem,
  onSuggestionsChange,
  ...props
}: Props<T>) {
  const { hits, sendEvent, results } = useInfiniteHits(props)
  const query = results?.query
  const previous = useRef<{
    snapshot: SuggestionsSnapshot
    notify: typeof onSuggestionsChange
  } | null>(null)

  useEffect(() => {
    if (query === undefined) return

    // Include displayed labels as well as ordered IDs, but exclude analytics metadata.
    const itemKeys = hits.map((hit) =>
      JSON.stringify([hit.objectID, hit.query, hit.name, hit.city])
    )
    const snapshot = { query, itemKeys }
    const next = { snapshot, notify: onSuggestionsChange }
    if (isEqual(previous.current, next)) return

    previous.current = next
    onSuggestionsChange?.(snapshot)
  }, [query, hits, onSuggestionsChange])

  if (!hits.length) return null

  return (
    <React.Fragment>
      <Title>{title}</Title>
      <StyledVerticalUl accessibilityLabel={title}>
        {hits.map((item) => (
          <Li key={item.objectID}>{renderItem(item as T, sendEvent)}</Li>
        ))}
      </StyledVerticalUl>
    </React.Fragment>
  )
}

const Title = styled(Typo.BodyAccentXs).attrs(setTextSemantic('h2'))(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledVerticalUl = styled(VerticalUl)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
