import { t } from '@lingui/macro'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { Section } from 'features/search/atoms/Sections'
import { _ } from 'libs/i18n'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { Typo, Spacer, ColorsEnum } from 'ui/theme'

export enum LocationChoice {
  LOCALIZED = 'LOCALIZED',
  EVERYWHERE = 'EVERYWHERE',
}

const getLocationChoiceName = (locationChoice: LocationChoice) => {
  switch (locationChoice) {
    case LocationChoice.LOCALIZED:
      return _(t`Autour de moi`)
    case LocationChoice.EVERYWHERE:
      return _(t`Partout`)
    default:
      return _(t`Partout`)
  }
}

const renderLocationContent = (locationChoice: LocationChoice) => {
  return (
    <React.Fragment>
      <LocationContentContainer>
        <Typo.ButtonText>{getLocationChoiceName(locationChoice)}</Typo.ButtonText>
        <ArrowNext size={24} />
      </LocationContentContainer>

      {locationChoice === LocationChoice.LOCALIZED && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Caption color={ColorsEnum.GREY_DARK}>
            {_(t`Seules les offres Sorties et Physiques seront affichés`)}
          </Typo.Caption>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export const LocationSection: React.FC = () => {
  return (
    <React.Fragment>
      <Section title={_(t`Localisation`)}>
        {renderLocationContent(LocationChoice.LOCALIZED)}
      </Section>
    </React.Fragment>
  )
}

const LocationContentContainer = styled(TouchableOpacity)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
})
