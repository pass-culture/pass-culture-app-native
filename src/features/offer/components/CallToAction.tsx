import React from 'react'
import styled from 'styled-components/native'

import { ExternalLinkSite } from 'ui/svg/icons/ExternalLinkSite'
import { Rectangle } from 'ui/svg/Rectangle'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
import { BorderRadiusEnum } from 'ui/theme/grid'

interface Props {
  wording: string
  onPress: (() => void) | (() => Promise<void>) | undefined
  isDisabled: boolean
  isExternal?: boolean
}

export const CallToAction: React.FC<Props> = ({
  wording,
  onPress,
  isDisabled,
  isExternal = false,
}) => (
  <Container onPress={onPress} disabled={isDisabled}>
    {isDisabled ? <DisabledRectangle /> : <Rectangle height={getSpacing(12)} size="100%" />}
    <Title adjustsFontSizeToFit numberOfLines={1}>
      {isExternal && (
        <IconContainer>
          <Spacer.Column numberOfSpaces={4} />
          <ExternalLinkSite color={ColorsEnum.WHITE} height={getSpacing(5)} width={getSpacing(5)} />
        </IconContainer>
      )}
      {wording}
    </Title>
  </Container>
)

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: BorderRadiusEnum.BUTTON,
  overflow: 'hidden',
})

const Title = styled(Typo.ButtonText)({
  position: 'absolute',
  color: ColorsEnum.WHITE,
  padding: getSpacing(5),
})

const DisabledRectangle = styled.View({
  width: '100%',
  height: getSpacing(12),
  backgroundColor: ColorsEnum.PRIMARY_DISABLED,
})

const IconContainer = styled.View({ width: getSpacing(2.75), height: getSpacing(2.75) })
