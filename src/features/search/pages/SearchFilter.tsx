import { t } from '@lingui/macro'
import React from 'react'
import { LayoutChangeEvent } from 'react-native'
import styled from 'styled-components/native'

import { CategorySection, RadiusSlider, PriceSlider } from 'features/search/components'
import { _ } from 'libs/i18n'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { SectionWithSwitch } from '../components/SectionWithSwitch'

const rightButton = (onLayout: (event: LayoutChangeEvent) => void): JSX.Element => {
  return (
    <Typo.ButtonText onLayout={onLayout} color={ColorsEnum.WHITE}>
      {_(t`Réinitialiser`)}
    </Typo.ButtonText>
  )
}

export const SearchFilter: React.FC = () => (
  <React.Fragment>
    <React.Fragment>
      <Container>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={16} />
        <RadiusSlider />
        <Spacer.Column numberOfSpaces={6} />
        <Separator />
        <CategorySection />
        <Separator />
        <Spacer.Column numberOfSpaces={6} />
        <PriceSlider />
        <Separator marginVertical={getSpacing(6)} />
        <SectionWithSwitch title={_(t`Uniquement les offres gratuites`)} />
        <Separator marginVertical={getSpacing(6)} />
        <SectionWithSwitch title={_(t`Uniquement les offres duo`)} />
        <Separator marginVertical={getSpacing(6)} />
        <SectionWithSwitch title={_(t`Uniquement les nouveautés`)} />
        <Separator marginVertical={getSpacing(6)} />
        <SectionWithSwitch
          title={_(t`Date`)}
          subtitle={_(t`Seules les offres Sorties seront affichées`)}
        />
        <Separator marginVertical={getSpacing(6)} />
        <SectionWithSwitch
          title={_(t`Heure`)}
          subtitle={_(t`Seules les offres Sorties seront affichées`)}
        />
        <Spacer.Column numberOfSpaces={6} />
      </Container>
    </React.Fragment>
    <PageHeader title={_(t`Filtrer`)} rightComponent={rightButton} />
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
