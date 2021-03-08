import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { AccordionItem } from 'features/offer/components'
import { _ } from 'libs/i18n'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, ColorsEnum, Typo, Spacer, ScreenWidth } from 'ui/theme'

import { accordionStyle, GreyContainer, Description } from './reusables'

type ExBeneficiaryHeaderProps = {
  depositExpirationDate?: string
}

export function ExBeneficiaryHeader(props: ExBeneficiaryHeaderProps) {
  return (
    <Container testID={'ex-beneficiary-header'}>
      <HeaderBackgroundWrapper>
        <HeaderBackground width={ScreenWidth} />
      </HeaderBackgroundWrapper>
      <TitleContainer>
        <Spacer.Column numberOfSpaces={12} />
        <Typo.Title4 color={ColorsEnum.WHITE}>{_(t`Profil`)}</Typo.Title4>
        <Spacer.Column numberOfSpaces={4} />
        {props.depositExpirationDate && (
          <Typo.Caption color={ColorsEnum.WHITE}>
            {_(t`crédit expiré le ${props.depositExpirationDate}`)}
          </Typo.Caption>
        )}
      </TitleContainer>
      <Spacer.Column numberOfSpaces={3.5} />
      <DescriptionContainer>
        <AccordionItem
          title={<Typo.ButtonText>{_(t`Mon crédit est expiré, que faire ?`)}</Typo.ButtonText>}
          titleStyle={accordionStyle.title}
          bodyStyle={accordionStyle.body}>
          <Description>
            {_(t`Ton crédit pass Culture est arrivé à expiration mais l’aventure continue !`)}
          </Description>
          <Spacer.Column numberOfSpaces={5} />
          <Description>
            {_(t`Tu peux toujours réserver les offres gratuites exclusives au pass Culture.`)}
          </Description>
          <Description>
            {_(
              t`Tu peux aussi découvrir les autres activités culturelles sur l'application
            mais leur réservation s'effectuera sur les sites de nos partenaires !`
            )}
          </Description>
        </AccordionItem>
        <Spacer.Column numberOfSpaces={2} />
      </DescriptionContainer>
    </Container>
  )
}

const Container = styled.View({
  alignItems: 'center',
  paddingHorizontal: getSpacing(5.5),
})

const HeaderBackgroundWrapper = styled.View({
  maxHeight: getSpacing(37),
  overflow: 'hidden',
  position: 'absolute',
})

const TitleContainer = styled.View({
  alignItems: 'center',
})

const DescriptionContainer = styled(GreyContainer)({})
