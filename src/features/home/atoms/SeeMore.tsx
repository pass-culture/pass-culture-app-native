import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { getSpacing, Spacer, Typo, getShadow } from 'ui/theme'

interface SeeMoreProps {
  height: number
  width: number
  onPress: () => void
}

export const SeeMore: React.FC<SeeMoreProps> = ({ height, width, onPress }) => (
  <Container height={height} width={width}>
    <Spacer.Column numberOfSpaces={2} />
    <ClickableArea activeOpacity={1} onPress={onPress}>
      <Row>
        <Spacer.Row numberOfSpaces={16} />
        <RoundContainer onPress={onPress}>
          <ArrowNext testID={'arrow-next'} />
        </RoundContainer>
        <Spacer.Row numberOfSpaces={16} />
      </Row>
      <Spacer.Column numberOfSpaces={2} />
      <Row>
        <ButtonText>{t`En voir plus`}</ButtonText>
      </Row>
    </ClickableArea>
  </Container>
)

const Row = styled.View({ flexDirection: 'row' })

const Container = styled.View<{ height: number; width: number }>(({ height, width }) => ({
  height,
  width,
  alignItems: 'center',
  justifyContent: 'center',
}))

const ClickableArea = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
  alignItems: 'center',
})

const RoundContainer = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))(({ theme }) => ({
  width: getSpacing(16),
  aspectRatio: '1',
  borderRadius: getSpacing(8),
  backgroundColor: theme.colors.white,
  border: 1,
  justifyContent: 'center',
  borderColor: theme.colors.greyLight,
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(2),
    },
    shadowRadius: getSpacing(3),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.15,
  }),
  alignItems: 'center',
}))

const ButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.primary,
}))

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.standard,
}))``
