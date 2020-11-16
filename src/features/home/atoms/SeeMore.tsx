import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { ColorsEnum, getSpacing, LENGTH_L, LENGTH_M, Spacer, Typo, getShadow } from 'ui/theme'

import { Layout } from '../contentful'
interface SeeMoreProps {
  layout?: Layout
  onPress?: () => void
}
export const SeeMore: React.FC<SeeMoreProps> = ({ layout, onPress }) => {
  const containerHeight = layout && layout === 'two-items' ? LENGTH_M : LENGTH_L

  return (
    <Container containerHeight={containerHeight}>
      <Spacer.Column numberOfSpaces={2} />
      <ClickableArea activeOpacity={1} onPress={onPress}>
        <Row>
          <Spacer.Row numberOfSpaces={16} />
          <RoundContainer onPress={onPress}>
            <ArrowNext size={56} color={ColorsEnum.PRIMARY} testID={'arrow-next'} />
          </RoundContainer>
          <Spacer.Row numberOfSpaces={16} />
        </Row>
        <Spacer.Column numberOfSpaces={2} />
        <Row>
          <Typo.ButtonText color={ColorsEnum.PRIMARY}>{_(t`En voir plus`)}</Typo.ButtonText>
        </Row>
      </ClickableArea>
    </Container>
  )
}

const Row = styled.View({ flexDirection: 'row' })
const Container = styled.View<{ containerHeight: number }>(({ containerHeight }) => ({
  height: containerHeight,
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
