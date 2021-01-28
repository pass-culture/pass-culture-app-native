import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

export const NoSearchResult: React.FC = () => {
  return (
    <Container>
      <NoOffer size={156} />
      <MainTitle>{_(t`Oups !`)}</MainTitle>
      <DescriptionErrorTextContainer>
        <DescriptionErrorText>{_(t`Pas de résultat trouvé`)}</DescriptionErrorText>
      </DescriptionErrorTextContainer>
      <DescriptionErrorTextContainer>
        <DescriptionErrorText>
          {_(t`Modifie ta recherche ou découvre toutes les offres`) + ' '}
        </DescriptionErrorText>
        <AroundMeText onPress={() => {}}>{_(t`autour de chez toi`)}</AroundMeText>
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
})

const AroundMeText = styled(Typo.ButtonText)({
  color: ColorsEnum.PRIMARY,
})
