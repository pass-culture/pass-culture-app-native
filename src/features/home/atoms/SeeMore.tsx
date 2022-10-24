import React from 'react'
import styled from 'styled-components/native'

import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { getSpacing, Spacer, Typo, getShadow } from 'ui/theme'

interface SeeMoreProps {
  height: number
  width: number
  navigateTo?: InternalNavigationProps['navigateTo']
  onPress: () => void
}

export const SeeMore: React.FC<SeeMoreProps> = ({ height, width, navigateTo, onPress }) => (
  <Container height={height} width={width}>
    <Spacer.Column numberOfSpaces={2} />
    <ClickableArea activeOpacity={1} navigateTo={navigateTo} onBeforeNavigate={onPress}>
      <Row>
        <Spacer.Row numberOfSpaces={16} />
        <RoundContainer>
          <ArrowNext testID={'arrow-next'} />
        </RoundContainer>
        <Spacer.Row numberOfSpaces={16} />
      </Row>
      <Spacer.Column numberOfSpaces={2} />
      <Row>
        <Typo.ButtonTextPrimary>En voir plus</Typo.ButtonTextPrimary>
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

const ClickableArea = styled(TouchableLink)({
  alignItems: 'center',
})

const CONTAINER_SIZE = getSpacing(16)
const RoundContainer = styled.View(({ theme }) => ({
  width: CONTAINER_SIZE,
  height: CONTAINER_SIZE,
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

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.standard,
}))``
