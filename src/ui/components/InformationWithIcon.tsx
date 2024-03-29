import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AccessibleBicolorIcon } from 'ui/svg/icons/types'
import { Spacer, Typo } from 'ui/theme'

export const InformationWithIcon: FunctionComponent<{
  Icon: React.FC<AccessibleBicolorIcon>
  text: string
  subtitle?: string
}> = ({ Icon, text, subtitle }) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    size: theme.icons.sizes.small,
  }))``

  return (
    <InfoContainer>
      <StyledIcon />
      <Spacer.Row numberOfSpaces={3.75} />
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

const InfoContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const Info = styled(Typo.Body)({
  flex: 1,
})

const Subtitle = styled(Typo.CaptionNeutralInfo)({
  flex: 1,
})

const TextContainer = styled.View({
  flexDirection: 'column',
  flexShrink: 1,
})
