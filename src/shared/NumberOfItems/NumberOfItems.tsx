import React from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { plural } from 'libs/plural'
import { Typo } from 'ui/theme'

interface Props {
  nbItems: number
  type?: 'results' | 'offers' | 'artists' | 'venues'
  noMargin?: boolean
}

const LABELS = {
  results: { singular: '# résultat', plural: '# résultats' },
  offers: { singular: '# offre', plural: '# offres' },
  artists: { singular: '# artiste', plural: '# artistes' },
  venues: { singular: '# lieu', plural: '# lieux' },
}

export const NumberOfItems: React.FC<Props> = ({ nbItems, type = 'results', noMargin = false }) => {
  if (!nbItems) return null

  const numberOfResults = plural(nbItems, LABELS[type])

  return (
    <Container accessibilityRole={AccessibilityRole.STATUS} noMargin={noMargin}>
      <Body>{numberOfResults}</Body>
    </Container>
  )
}

const Container = styled.View<{ noMargin: boolean }>(({ theme, noMargin }) => ({
  marginTop: noMargin ? 0 : theme.designSystem.size.spacing.xs,
  marginBottom: noMargin ? 0 : theme.designSystem.size.spacing.l,
}))

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
