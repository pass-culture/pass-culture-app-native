import { t } from '@lingui/macro'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { useSearch } from 'features/search/pages/SearchWrapper'
import { useGeolocation } from 'libs/geolocation'
import { _ } from 'libs/i18n'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

export const NoSearchResult: React.FC = () => {
  const position = useGeolocation()
  const { dispatch, searchState } = useSearch()
  const query = searchState.query
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 400)
    return () => clearTimeout(handler)
  }, [query])

  const handlePressAroundMe = () => {
    dispatch({ type: 'INIT' })
    dispatch({ type: 'SHOW_RESULTS', payload: true })
    dispatch({ type: 'SET_QUERY', payload: '' })

    if (position !== null) {
      const payload = { latitude: position.latitude, longitude: position.longitude }
      dispatch({ type: 'LOCATION_AROUND_ME', payload })
    } else {
      // Special case: ask for the user permission to enablee geolocation ?
    }
  }

  return (
    <Container>
      <NoOffer size={156} />
      <MainTitle>{_(t`Oups !`)}</MainTitle>
      <DescriptionErrorTextContainer>
        <DescriptionErrorText>{_(t`Pas de résultat trouvé`) + ' '}</DescriptionErrorText>
        {debouncedQuery && (
          <DescriptionErrorText>{_(t`pour "`) + debouncedQuery + _(t`"`)}</DescriptionErrorText>
        )}
      </DescriptionErrorTextContainer>
      <DescriptionErrorTextContainer>
        <DescriptionErrorText>
          {_(t`Modifie ta recherche ou découvre toutes les offres`) + ' '}
        </DescriptionErrorText>
        <AroundMeText onPress={handlePressAroundMe}>{_(t`autour de chez toi`)}</AroundMeText>
      </DescriptionErrorTextContainer>
    </Container>
  )
}

const Container = styled.View({
  height: '100%',
  flexDirection: 'column',
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
