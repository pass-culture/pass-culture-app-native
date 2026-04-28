import React from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { plural } from 'libs/plural'
import { Typo } from 'ui/theme'

interface Props {
  nbItems: number
  type?: 'results' | 'offers' | 'artists' | 'venues'
}

const LABELS = {
  results: { singular: '# résultat', plural: '# résultats' },
  offers: { singular: '# offre', plural: '# offres' },
  artists: { singular: '# artiste', plural: '# artistes' },
  venues: { singular: '# lieu', plural: '# lieux' },
}

export const NumberOfItems: React.FC<Props> = ({ nbItems, type = 'results' }) => {
  if (!nbItems) return null

  const numberOfResults = plural(nbItems, LABELS[type])

  return (
    <Container accessibilityRole={AccessibilityRole.STATUS}>
      <Body>{numberOfResults}</Body>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xs,
  marginBottom: theme.designSystem.size.spacing.l,
}))

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
