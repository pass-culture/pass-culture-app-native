import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ButtonSecondaryWhite } from 'ui/components/buttons/ButtonSecondaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { BrokenConnection } from 'ui/svg/BrokenConnection'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const NoContentError = () => (
  <GenericInfoPage title={t`Oups !`} icon={BrokenConnection} iconSize={200}>
    <BodyText>{t`Une erreur s’est produite pendant le chargement de nos recommandations.`}</BodyText>
    <Spacer.Column numberOfSpaces={4} />
    <SearchButton title={t`Rechercher une offre`} icon={MagnifyingGlass} />
  </GenericInfoPage>
)

const BodyText = styled(Typo.Body).attrs(({ theme }) => ({ color: theme.colors.white }))({
  textAlign: 'center',
})

const SearchButton = styled(ButtonSecondaryWhite).attrs({
  iconSize: 22,
})({
  width: 'auto',
  paddingLeft: getSpacing(6),
  paddingRight: getSpacing(6),
})
