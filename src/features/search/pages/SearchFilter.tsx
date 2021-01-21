import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { SearchResultsButton, ReinitializeFiltersButton } from 'features/search/atoms'
import {
  CategorySection,
  FreeOfferSection,
  LocationSection,
  OfferTypeSection,
  PriceSlider,
  RadiusSlider,
  SectionWithSwitch,
  CalendarPicker,
} from 'features/search/components'
import { _ } from 'libs/i18n'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

export const SearchFilter: React.FC = () => (
  <React.Fragment>
    <React.Fragment>
      <Container>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={16} />
        <LocationSection />
        <Separator marginVertical={getSpacing(6)} />
        <RadiusSlider />
        <Spacer.Column numberOfSpaces={6} />
        <Separator />
        <CategorySection />
        <Spacer.Column numberOfSpaces={2} />
        <Separator />
        <OfferTypeSection />
        <Spacer.Column numberOfSpaces={2} />
        <Separator />
        <Spacer.Column numberOfSpaces={6} />
        <PriceSlider />
        <Separator marginVertical={getSpacing(6)} />
        <FreeOfferSection />
        <Separator marginVertical={getSpacing(6)} />
        <SectionWithSwitch title={_(t`Uniquement les offres duo`)} />
        <Separator marginVertical={getSpacing(6)} />
        <SectionWithSwitch title={_(t`Uniquement les nouveautés`)} />
        <Separator marginVertical={getSpacing(6)} />
        <SectionWithSwitch
          title={_(t`Date`)}
          subtitle={_(t`Seules les offres Sorties seront affichées`)}
        />
        <CalendarPicker />
        <Separator marginVertical={getSpacing(6)} />
        <SectionWithSwitch
          title={_(t`Heure`)}
          subtitle={_(t`Seules les offres Sorties seront affichées`)}
        />
        <Spacer.Column numberOfSpaces={30} />
      </Container>
    </React.Fragment>
    <PageHeader title={_(t`Filtrer`)} RightComponent={ReinitializeFiltersButton} />
    <SearchResultsButtonContainer>
      <SearchResultsButton />
      <Spacer.BottomScreen />
    </SearchResultsButtonContainer>
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
const SearchResultsButtonContainer = styled.View({
  width: '100%',
  position: 'absolute',
  bottom: getSpacing(6),
  paddingHorizontal: getSpacing(6),
})
