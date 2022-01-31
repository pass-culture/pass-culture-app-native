import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen/api'
import { AccordionItem } from 'ui/components/AccordionItem'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, Typo, Spacer } from 'ui/theme'

import { accordionStyle, GreyContainer, Description } from './reusables'

type ExBeneficiaryHeaderProps = {
  firstName?: string | null
  lastName?: string | null
  domainsCredit?: DomainsCredit | null
  depositExpirationDate?: string
}

export function ExBeneficiaryHeader(props: ExBeneficiaryHeaderProps) {
  const { firstName, lastName, depositExpirationDate } = props
  const name = `${firstName} ${lastName}`

  return (
    <Container testID={'ex-beneficiary-header'}>
      <Spacer.TopScreen />
      <HeaderBackgroundWrapper>
        <HeaderBackground />
      </HeaderBackgroundWrapper>
      <Spacer.Column numberOfSpaces={6} />
      <TitleContainer>
        <Title4>{name}</Title4>
        <Spacer.Column numberOfSpaces={4.5} />
        {!!depositExpirationDate && (
          <Caption>
            {t({
              id: 'credit expired on date',
              values: { deadline: depositExpirationDate },
              message: 'crédit expiré le {deadline}',
            })}
          </Caption>
        )}
      </TitleContainer>
      <Spacer.Column numberOfSpaces={6} />
      <DescriptionContainer>
        <AccordionItem
          title={<Typo.ButtonText>{t`Mon crédit est expiré, que faire\u00a0?`}</Typo.ButtonText>}
          titleStyle={accordionStyle.title}
          bodyStyle={accordionStyle.body}>
          <Description>
            {t`Ton crédit pass Culture est arrivé à expiration mais l’aventure continue\u00a0!`}
          </Description>
          <Spacer.Column numberOfSpaces={5} />
          <Description>
            {t`Tu peux toujours réserver les offres gratuites exclusives au pass Culture.`}
          </Description>
          <Description>
            {t`Tu peux aussi découvrir les autres activités culturelles sur l'application mais leur réservation s'effectuera sur les sites de nos partenaires\u00a0!`}
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
  maxHeight: getSpacing(45),
  overflow: 'hidden',
  position: 'absolute',
})

const TitleContainer = styled.View({
  alignItems: 'center',
})

const DescriptionContainer = styled(GreyContainer)({})

const Title4 = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.white,
}))

const Caption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.white,
}))
