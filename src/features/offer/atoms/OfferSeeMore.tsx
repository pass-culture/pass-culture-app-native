import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { analytics } from 'libs/firebase/analytics'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { Spacer } from 'ui/theme'

interface Props {
  id: number
  longWording?: boolean
}
export const OfferSeeMore: React.FC<Props> = ({ id, longWording = false }) => {
  const onPressSeeMore = useCallback(() => {
    analytics.logConsultDescriptionDetails(id)
  }, [id])

  return (
    <Container>
      <TouchableLink
        as={ButtonTertiaryBlack}
        inline
        testID="description-details-button"
        onPress={onPressSeeMore}
        navigateTo={{ screen: 'OfferDescription', params: { id } }}
        wording={longWording ? 'Voir plus d’informations' : 'voir plus'}
        accessibilityLabel={longWording ? undefined : 'Voir la suite de la description'}
      />
      <Spacer.Row numberOfSpaces={1} />
      <ArrowNext />
    </Container>
  )
}

const Container = styled.View({ flexDirection: 'row', alignItems: 'center' })
const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
