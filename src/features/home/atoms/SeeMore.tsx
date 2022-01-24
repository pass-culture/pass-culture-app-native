import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { getSpacing, Spacer, Typo, getShadow } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

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
          <ArrowNext size={40} color={ColorsEnum.PRIMARY} testID={'arrow-next'} />
        </RoundContainer>
        <Spacer.Row numberOfSpaces={16} />
      </Row>
      <Spacer.Column numberOfSpaces={2} />
      <Row>
        <Typo.ButtonText color={ColorsEnum.PRIMARY}>{t`En voir plus`}</Typo.ButtonText>
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

const ClickableArea = styled.TouchableOpacity({
  alignItems: 'center',
})
const RoundContainer = styled.TouchableOpacity({
  width: getSpacing(16),
  aspectRatio: '1',
  borderRadius: getSpacing(8),
  backgroundColor: ColorsEnum.WHITE,
  border: 1,
  justifyContent: 'center',
  borderColor: ColorsEnum.GREY_LIGHT,
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(2),
    },
    shadowRadius: getSpacing(3),
    shadowColor: ColorsEnum.BLACK,
    shadowOpacity: 0.15,
  }),
  alignItems: 'center',
})
