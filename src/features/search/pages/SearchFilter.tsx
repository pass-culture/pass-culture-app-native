import { t } from '@lingui/macro'
import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

import { ShowResults, ReinitializeFilters } from 'features/search/atoms/Buttons'
import { LocationSection } from 'features/search/components'
import { useSearch } from 'features/search/pages/SearchWrapper'
import Section from 'features/search/sections'
import { _ } from 'libs/i18n'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

export const SearchFilter: React.FC = () => {
  const { searchState } = useSearch()
  return (
    <React.Fragment>
      <React.Fragment>
        <Container>
          <Spacer.TopScreen />
          <Spacer.Column numberOfSpaces={16} />

          {/* Localisation */}
          <LocationSection />
          <Separator marginVertical={getSpacing(6)} />

          {/* Rayon */}
          <Section.Radius />
          <Spacer.Column numberOfSpaces={6} />
          <Separator />

          {/* Catégories */}
          <Section.Category />
          <Spacer.Column numberOfSpaces={2} />
          <Separator />

          {/* Type d'offre */}
          <Section.OfferType />
          <Spacer.Column numberOfSpaces={2} />
          <Separator />
          <Spacer.Column numberOfSpaces={6} />

          {/* Prix */}
          <Section.Price />
          <Separator marginVertical={getSpacing(6)} />

          {/* Uniquement les offres gratuites */}
          <Section.FreeOffer />
          <Separator marginVertical={getSpacing(6)} />

          {/* Uniquement les offres duo */}
          <Section.DuoOffer />
          <Separator marginVertical={getSpacing(6)} />

          {/* Uniquement les nouveautés */}
          <Section.NewOffer />
          <Separator marginVertical={getSpacing(6)} />

          {/* Date */}
          <Section.Date />
          <Separator marginVertical={getSpacing(6)} />

          {/* Date de l'offre */}
          {!!searchState.date && (
            <React.Fragment>
              <Section.OfferDate />
              <Separator marginVertical={getSpacing(6)} />
            </React.Fragment>
          )}

          {/* Heure */}
          <Section.Hour />

          {/*Créneau horaire */}
          {!!searchState.timeRange && (
            <React.Fragment>
              <Separator marginVertical={getSpacing(6)} />
              <Section.TimeSlot />
            </React.Fragment>
          )}

          <Spacer.Column numberOfSpaces={30} />
        </Container>
      </React.Fragment>

      <PageHeader title={_(t`Filtrer`)} RightComponent={ReinitializeFilters} />

      <ShowResultsContainer>
        <ShowResults />
        <Spacer.BottomScreen />
      </ShowResultsContainer>
    </React.Fragment>
  )
}

const { width } = Dimensions.get('window')
const Container = styled.ScrollView({ flex: 1 })
const Separator = styled.View<{ marginVertical?: number }>(({ marginVertical = 0 }) => ({
  width: width - getSpacing(2 * 6),
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
  alignSelf: 'center',
  marginVertical: marginVertical,
}))
const ShowResultsContainer = styled.View({
  width: '100%',
  position: 'absolute',
  bottom: getSpacing(6),
  paddingHorizontal: getSpacing(6),
})
