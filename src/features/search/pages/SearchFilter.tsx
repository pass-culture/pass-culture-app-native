import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ShowResults, ReinitializeFilters } from 'features/search/atoms/Buttons'
import { LocationSection, SectionWithSwitch } from 'features/search/components'
import Section from 'features/search/sections'
import { _ } from 'libs/i18n'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

export const SearchFilter: React.FC = () => (
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
        <SectionWithSwitch
          title={_(t`Date`)}
          subtitle={_(t`Seules les offres Sorties seront affichées`)}
        />
        <Separator marginVertical={getSpacing(6)} />

        {/* Date de l'offre */}
        <Section.OfferDate />
        <Separator marginVertical={getSpacing(6)} />

        {/* Heure */}
        <SectionWithSwitch
          title={_(t`Heure`)}
          subtitle={_(t`Seules les offres Sorties seront affichées`)}
        />
        {/* TODO (#6420): Créneau horaire */}
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

const Container = styled.ScrollView({ flex: 1 })
const Separator = styled.View<{ marginVertical?: number }>(({ marginVertical = 0 }) => ({
  width: '100%',
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
  alignSelf: 'center',
  marginHorizontal: getSpacing(6),
  marginVertical: marginVertical,
}))
const ShowResultsContainer = styled.View({
  width: '100%',
  position: 'absolute',
  bottom: getSpacing(6),
  paddingHorizontal: getSpacing(6),
})
