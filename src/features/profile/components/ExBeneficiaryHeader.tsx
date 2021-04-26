import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen/api'
import { AccordionItem } from 'features/offer/components'
import { computeCredit } from 'features/profile/utils'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, ColorsEnum, Typo, Spacer, ScreenWidth } from 'ui/theme'

import { accordionStyle, GreyContainer, Description } from './reusables'

type ExBeneficiaryHeaderProps = {
  firstName?: string | null
  lastName?: string | null
  domainsCredit?: DomainsCredit | null
  depositExpirationDate?: string
}

export function ExBeneficiaryHeader(props: ExBeneficiaryHeaderProps) {
  const { firstName, lastName, domainsCredit, depositExpirationDate } = props
  return (
    <Container testID={'ex-beneficiary-header'}>
      <HeaderBackgroundWrapper>
        <HeaderBackground width={ScreenWidth} />
      </HeaderBackgroundWrapper>
      <Spacer.Column numberOfSpaces={12} />
      <TitleContainer>
        <Typo.Title4 color={ColorsEnum.WHITE}>{t`${firstName} ${lastName}`}</Typo.Title4>
        <Spacer.Column numberOfSpaces={4.5} />
        <Typo.Hero color={ColorsEnum.WHITE}>
          {t`${convertCentsToEuros(computeCredit(domainsCredit))} €`}
        </Typo.Hero>
        <Spacer.Column numberOfSpaces={2} />
        {depositExpirationDate && (
          <Typo.Caption color={ColorsEnum.WHITE}>
            {t({
              id: 'credit expired on date',
              values: { deadline: depositExpirationDate },
              message: 'crédit expiré le {deadline}',
            })}
          </Typo.Caption>
        )}
      </TitleContainer>
      <Spacer.Column numberOfSpaces={6} />
      <DescriptionContainer>
        <AccordionItem
          title={<Typo.ButtonText>{t`Mon crédit est expiré, que faire ?`}</Typo.ButtonText>}
          titleStyle={accordionStyle.title}
          bodyStyle={accordionStyle.body}>
          <Description>
            {t`Ton crédit pass Culture est arrivé à expiration mais l’aventure continue !`}
          </Description>
          <Spacer.Column numberOfSpaces={5} />
          <Description>
            {t`Tu peux toujours réserver les offres gratuites exclusives au pass Culture.`}
          </Description>
          <Description>
            {t`Tu peux aussi découvrir les autres activités culturelles sur l'application mais leur réservation s'effectuera sur les sites de nos partenaires !`}
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
  maxHeight: getSpacing(60),
  overflow: 'hidden',
  position: 'absolute',
})

const TitleContainer = styled.View({
  alignItems: 'center',
})

const DescriptionContainer = styled(GreyContainer)({})
