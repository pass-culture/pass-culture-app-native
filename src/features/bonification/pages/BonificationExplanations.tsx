import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { styled } from 'styled-components/native'

import { CurrencyEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { env } from 'libs/environment/env'
import {
  useBonificationBonusAmount,
  useBonificationQfThreshold,
  usePacificFrancToEuroRate,
} from 'queries/settings/useSettings'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { Form } from 'ui/components/Form'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Button } from 'ui/designSystem/Button/Button'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Speaker } from 'ui/svg/icons/Speaker'
import { WarningFilled } from 'ui/svg/icons/WarningFilled'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const BonificationExplanations = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { user } = useAuthContext()
  const isUserRegisteredInPacificFrancRegion = user?.currency === CurrencyEnum.XPF
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const { data: bonificationBonusAmount } = useBonificationBonusAmount()
  const formattedBonificationAmount = formatCurrencyFromCents(
    bonificationBonusAmount,
    currency,
    euroToPacificFrancRate
  )
  const { data: bonificationQfThreshold } = useBonificationQfThreshold()
  const qfThresholdInCents = (bonificationQfThreshold || 700) * 100
  const familyQuotientLevel = formatCurrencyFromCents(
    qfThresholdInCents,
    currency,
    euroToPacificFrancRate
  )

  const bannerLabel = isUserRegisteredInPacificFrancRegion
    ? 'Si tu habites en Nouvelle-Calédonie, tu ne pourras malheureusement pas bénéficier du bonus.'
    : 'Si ce n’est pas ton cas, ta demande sera refusée.'

  return (
    <PageWithHeader
      title="Informations"
      scrollChildren={
        <Form.MaxWidth>
          <ViewGap gap={4}>
            <Container>
              <StyledSpeaker />
            </Container>
            <StyledTitle3 {...getHeadingAttrs(2)}>
              Quel est ce bonus et comment en bénéficier&nbsp;?
            </StyledTitle3>
            <Typo.Body>
              Ce bonus de
              <Typo.BodyAccent>{SPACE + formattedBonificationAmount + SPACE}</Typo.BodyAccent>
              est réservé aux jeunes dont la famille ou les tuteurs légaux ont un
              <Typo.BodyAccent>
                {` quotient familial inférieur ou égal à ${familyQuotientLevel}.`}
              </Typo.BodyAccent>
            </Typo.Body>
            <Banner label={bannerLabel} Icon={WarningFilled} />
            <Typo.Body>
              Remplis les informations de ton parent ou représentant légal pour savoir si tu peux en
              bénéficier.
            </Typo.Body>
          </ViewGap>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <ViewGap gap={4}>
          <Button
            fullWidth
            type="submit"
            wording="Continuer"
            isLoading={false}
            accessibilityLabel="Continuer vers les informations requises"
            onPress={() =>
              navigate(...getSubscriptionHookConfig('BonificationRequiredInformation'))
            }
          />
          <ExternalTouchableLink
            as={Button}
            variant="tertiary"
            color="neutral"
            wording="Plus d’infos sur le quotient familial"
            externalNav={{ url: env.FAQ_LINK_CAF_QUOTIEN_FAMILIAL }}
            icon={ExternalSiteFilled}
          />
          <StyledBodyS>
            Si tu es en <Typo.BodyAccentS>situation de handicap</Typo.BodyAccentS>, un peu de
            patience, ton cas sera pris en compte prochainement.
          </StyledBodyS>
        </ViewGap>
      }
    />
  )
}

const StyledSpeaker = styled(Speaker).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.illustrations.sizes.fullPage,
}))``

const Container = styled.View({
  alignItems: 'center',
})

const StyledTitle3 = styled(Typo.Title3)({
  textAlign: 'center',
})

const StyledBodyS = styled(Typo.BodyS)({
  textAlign: 'center',
})
