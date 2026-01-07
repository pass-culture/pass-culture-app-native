import React, { PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { Separator } from './Separator'

type SectionProps = PropsWithChildren<{
  title?: string
}>

export function Section(props: SectionProps) {
  return (
    <Container>
      {props.title ? <CaptionNeutralInfo>{props.title}</CaptionNeutralInfo> : null}
      <StyledSeparator />
      {props.children}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.s,
}))

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.s,
}))

const CaptionNeutralInfo = styled(Typo.BodyAccentXs).attrs(getHeadingAttrs(2))(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
