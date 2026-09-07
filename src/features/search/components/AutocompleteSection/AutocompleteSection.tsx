import { SendEventForHits } from 'instantsearch.js/es/lib/utils'
import React, { useEffect } from 'react'
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
  // Include displayed labels as well as ordered IDs, but exclude analytics metadata.
  const signature = JSON.stringify(
    hits.map((hit) => JSON.stringify([hit.objectID, hit.query, hit.name, hit.city]))
  )

  useEffect(() => {
    if (query === undefined) return
    onSuggestionsChange?.({ query, itemKeys: JSON.parse(signature) as string[] })
  }, [query, signature, onSuggestionsChange])

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
