import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { Typo } from 'ui/theme'

export type SummaryInfoProps = {
  Icon: ReactElement
  title: string
  subtitle?: string
}

export function SummaryInfo({ Icon, title, subtitle }: Readonly<SummaryInfoProps>) {
  return (
    <React.Fragment>
      <Container>
        <IconContainer>{Icon}</IconContainer>
        <TextContainer>
          <Typo.Body>{title}</Typo.Body>
          {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
        </TextContainer>
      </Container>
      <Separator.Horizontal testID="bottomSeparator" />
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  marginVertical: theme.designSystem.size.spacing.l,
  alignItems: 'center',
  width: '100%',
}))

const IconContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.l,
}))

const TextContainer = styled.View(({ theme }) => ({
  flexShrink: 1,
  flexGrow: 1,
  gap: theme.designSystem.size.spacing.xs,
}))
const Subtitle = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
