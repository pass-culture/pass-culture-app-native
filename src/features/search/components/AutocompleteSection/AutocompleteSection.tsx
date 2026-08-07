import { SendEventForHits } from 'instantsearch.js/es/lib/utils'
import React from 'react'
import { useInfiniteHits, UseInfiniteHitsProps } from 'react-instantsearch-core'
import { styled } from 'styled-components/native'

import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { Typo } from 'ui/theme'
import { getTextSemanticAttrs } from 'ui/theme/typographyAttrs/getTextSemanticAttrs'

type Props<T> = {
  title: string
  renderItem: (hit: T, sendEvent: SendEventForHits) => React.ReactNode
} & UseInfiniteHitsProps

export function AutocompleteSection<T>({ title, renderItem, ...props }: Props<T>) {
  const { hits, sendEvent } = useInfiniteHits(props)
  if (!hits.length) return null

  return (
    <React.Fragment>
      <Title>{title}</Title>
      <StyledVerticalUl>
        {hits.map((item) => (
          <Li key={item.objectID}>{renderItem(item as T, sendEvent)}</Li>
        ))}
      </StyledVerticalUl>
    </React.Fragment>
  )
}

const Title = styled(Typo.BodyAccentXs).attrs(getTextSemanticAttrs(2))(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledVerticalUl = styled(VerticalUl)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
