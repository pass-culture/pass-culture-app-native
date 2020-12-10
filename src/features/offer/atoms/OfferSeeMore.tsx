import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  longWording?: boolean
}
export const OfferSeeMore: React.FC<Props> = ({ longWording = false }) => {
  return (
    <PressableContainer>
      <Typo.ButtonText>
        {longWording ? _(t`Voir plus d'informations`) : _(t`voir plus`)}
      </Typo.ButtonText>
      <Spacer.Row numberOfSpaces={1} />
      <ArrowNext size={getSpacing(6)} />
    </PressableContainer>
  )
}

const PressableContainer = styled.TouchableOpacity({ flexDirection: 'row', alignItems: 'center' })
