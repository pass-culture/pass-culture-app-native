import React from 'react'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { CircledClock } from 'ui/svg/icons/CircledClock'
import { Typo } from 'ui/theme'

type Props = { isOpenToPublic: boolean }

export const NoInformationPlaceholder = ({ isOpenToPublic }: Props) => (
  <Container gap={2}>
    <NoInfoIllustration />
    <Text>
      {isOpenToPublic
        ? 'Les infos pratiques ne sont pas encore renseignées pour ce lieu'
        : 'Les infos pratiques ne sont pas encore renseignées pour cette structure'}
    </Text>
  </Container>
)

const Container = styled(ViewGap)(({ theme }) => ({
  alignItems: 'center',
  marginHorizontal: theme.designSystem.size.spacing.xxl,
}))

const NoInfoIllustration = styled(CircledClock).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
}))``

const Text = styled(Typo.Title4)(({ theme }) => ({
  textAlign: 'center',
  marginVertical: theme.designSystem.size.spacing.xl,
}))
