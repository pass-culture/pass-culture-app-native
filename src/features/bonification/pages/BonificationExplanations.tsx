import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { styled } from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { env } from 'libs/environment/env'
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
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const bonificationAmount = formatCurrencyFromCents(5000, currency, euroToPacificFrancRate) // get amount from backend
  const familyQuotientLevel = 'XX' // get from backend?

  return (
    <PageWithHeader
      title="Informations Personnelles"
      scrollChildren={
        <Form.MaxWidth>
          <ViewGap gap={4}>
            <Container>
              <StyledSpeaker />
            </Container>
            <Typo.Title3 {...getHeadingAttrs(2)}>
              Quel est ce bonus et comment en bénéficier&nbsp;?
            </Typo.Title3>
            <Typo.Body>
              Ce bonus de
              <Typo.BodyAccent>{SPACE + bonificationAmount + SPACE}</Typo.BodyAccent>
              est réservé aux jeunes dont la famille ou les tuteurs légaux ont un
              <Typo.BodyAccent>
                {` quotient familial inférieur à ${familyQuotientLevel}.`}
              </Typo.BodyAccent>
            </Typo.Body>
            <Banner
              label="Si ce n’est pas ton cas, ta demande sera refusée."
              Icon={WarningFilled}
            />
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
