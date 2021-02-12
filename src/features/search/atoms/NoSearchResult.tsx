import { t } from '@lingui/macro'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { useSearch } from 'features/search/pages/SearchWrapper'
import { analytics } from 'libs/analytics'
import { useGeolocation } from 'libs/geolocation'
import { _ } from 'libs/i18n'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export const NoSearchResult: React.FC = () => {
  const { position } = useGeolocation()
  const { searchState, dispatch } = useSearch()
  const { query } = searchState

  useEffect(() => {
    analytics.logNoSearchResult(query)
  }, [query])

  const handlePressAroundMe = () => {
    dispatch({ type: 'INIT' })
    dispatch({ type: 'SET_QUERY', payload: '' })

    if (position !== null) {
      const payload = { latitude: position.latitude, longitude: position.longitude }
      dispatch({ type: 'LOCATION_AROUND_ME', payload })
    } else {
      dispatch({ type: 'LOCATION_EVERYWHERE' })
    }
  }

  const errorMessage =
    query.length > 0
      ? _(t`Pas de résultat trouvé pour`) + ` "${query}"`
      : _(t`Pas de résultat trouvé.`)

  return (
    <Container>
      <Spacer.Flex />
      <NoOffer size={156} />
      <MainTitle>{_(t`Oups !`)}</MainTitle>
      <DescriptionErrorTextContainer>
        <DescriptionErrorText>{errorMessage}</DescriptionErrorText>
      </DescriptionErrorTextContainer>
      <DescriptionErrorTextContainer>
        <DescriptionErrorText>
          {_(t`Modifie ta recherche ou découvre toutes les offres`) + ' '}
        </DescriptionErrorText>
        <AroundMeText onPress={handlePressAroundMe}>{_(t`autour de toi`)}</AroundMeText>
      </DescriptionErrorTextContainer>
      <Spacer.Flex />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal: getSpacing(14.5),
})

const MainTitle = styled(Typo.Title4)({
  color: ColorsEnum.GREY_DARK,
  marginTop: getSpacing(2),
})

const DescriptionErrorText = styled(Typo.Body)({
  color: ColorsEnum.GREY_DARK,
})

const DescriptionErrorTextContainer = styled.Text({
  marginTop: getSpacing(6.5),
  textAlign: 'center',
})

const AroundMeText = styled(Typo.ButtonText)({
  color: ColorsEnum.PRIMARY,
})
