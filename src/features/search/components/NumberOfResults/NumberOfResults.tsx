import React from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { plural } from 'libs/plural'
import { Typo } from 'ui/theme'

interface Props {
  nbHits: number
}

export const NumberOfResults: React.FC<Props> = ({ nbHits }) => {
  const numberOfResults = plural(nbHits, {
    singular: '# résultat',
    plural: '# résultats',
  })

  if (!nbHits) return null

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
