import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

export const InformationWithIcon: FunctionComponent<{
  Icon: React.FC<AccessibleIcon>
  text: string
  subtitle?: string
}> = ({ Icon, text, subtitle }) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    size: theme.icons.sizes.small,
    color: theme.designSystem.color.icon.brandPrimary,
  }))``

  return (
    <InfoContainer gap={3.75}>
      <StyledIcon />
      {subtitle ? (
        <TextContainer>
          <Info>{text}</Info>
          <Subtitle>{subtitle}</Subtitle>
        </TextContainer>
      ) : (
        <Info>{text}</Info>
      )}
    </InfoContainer>
  )
}

const InfoContainer = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
})

const Info = styled(Typo.Body)({
  flex: 1,
})

const Subtitle = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  flex: 1,
}))

const TextContainer = styled.View({
  flexDirection: 'column',
  flexShrink: 1,
})
