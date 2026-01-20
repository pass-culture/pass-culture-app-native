import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { styled } from 'styled-components/native'

import { CurrencyEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { env } from 'libs/environment/env'
import { bonificationAmountFallbackValue } from 'shared/credits/defaultCreditByAge'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Form } from 'ui/components/Form'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Speaker } from 'ui/svg/icons/Speaker'
import { WarningFilled } from 'ui/svg/icons/WarningFilled'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const BonificationExplanations = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: settings } = useSettingsContext()
  const { user } = useAuthContext()
  const isUserRegisteredInPacificFrancRegion = user?.currency === CurrencyEnum.XPF
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const bonificationAmount = formatCurrencyFromCents(
    settings?.bonification.bonusAmount || bonificationAmountFallbackValue,
    currency,
    euroToPacificFrancRate
  )
  const familyQuotientLevel = settings?.bonification.qfThreshold || 700

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
              <Typo.BodyAccent>{SPACE + bonificationAmount + SPACE}</Typo.BodyAccent>
              est réservé aux jeunes dont la famille ou les tuteurs légaux ont un
              <Typo.BodyAccent>
                {` quotient familial inférieur à ${familyQuotientLevel}.`}
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
        <ViewGap gap={3}>
          <ButtonPrimary
            wording="Continuer"
            isLoading={false}
            type="submit"
            accessibilityLabel="Continuer vers les informations requises"
            onPress={() =>
              navigate(...getSubscriptionHookConfig('BonificationRequiredInformation'))
            }
          />
          <ExternalTouchableLink
            as={ButtonTertiaryBlack}
            wording="Plus d’infos sur le quotient familial"
            externalNav={{ url: env.FAQ_LINK_CAF_QUOTIEN_FAMILIAL }}
            icon={ExternalSiteFilled}
          />
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
