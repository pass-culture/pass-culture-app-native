import { t } from '@lingui/macro'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { Info } from 'ui/svg/icons/Info'
import { ColorsEnum, Spacer, getSpacing, Typo } from 'ui/theme'

export const Banner: React.FC = () => (
  <Background>
    <Spacer.Row numberOfSpaces={3} />
    <Info size={32} />
    <Spacer.Row numberOfSpaces={3} />
    <TextContainer>
      <Typo.Caption color={ColorsEnum.GREY_DARK}>
        {_(
          t`Seules les offres Sorties et Physiques seront affichées pour une recherche avec une localisation`
        )}
      </Typo.Caption>
    </TextContainer>
    <Spacer.Row numberOfSpaces={5} />
  </Background>
)

const Background = styled(View)({
  display: 'flex',
  backgroundColor: ColorsEnum.GREY_LIGHT,
  marginHorizontal: getSpacing(6),
  paddingVertical: getSpacing(4),
  alignItems: 'center',
  flexDirection: 'row',
  borderRadius: getSpacing(1),
})

const TextContainer = styled(View)({
  flexShrink: 1,
})
