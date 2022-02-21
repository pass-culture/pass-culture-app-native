import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useCallback } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { Spacer } from 'ui/theme'
import { Link } from 'ui/web/link/Link'

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
      <Link to={{ screen: 'OfferDescription', params: { id } }} accessible={false}>
        <ButtonTertiaryBlack
          inline
          testID="description-details-button"
          onPress={onPressSeeMore}
          wording={longWording ? t`Voir plus d'informations` : t`voir plus`}
        />
      </Link>
      <Spacer.Row numberOfSpaces={1} />
      <ArrowNext />
    </Container>
  )
}

const Container = styled.View({ flexDirection: 'row', alignItems: 'center' })
const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
