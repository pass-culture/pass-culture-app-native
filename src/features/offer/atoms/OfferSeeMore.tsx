import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useCallback } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ArrowNextDeprecated as ArrowNext } from 'ui/svg/icons/ArrowNext_deprecated'
import { getSpacing, Spacer } from 'ui/theme'

interface Props {
  id: number
  longWording?: boolean
}
export const OfferSeeMore: React.FC<Props> = ({ id, longWording = false }) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const onPressSeeMore = useCallback(() => {
    analytics.logConsultDescriptionDetails(id)
    navigate('OfferDescription', { id })
  }, [id])

  return (
    <Container>
      <ButtonTertiaryBlack
        inline
        testId="description-details-button"
        onPress={onPressSeeMore}
        title={longWording ? t`Voir plus d'informations` : t`voir plus`}
      />
      <Spacer.Row numberOfSpaces={1} />
      <ArrowNext size={getSpacing(6)} />
    </Container>
  )
}

const Container = styled.View({ flexDirection: 'row', alignItems: 'center' })
