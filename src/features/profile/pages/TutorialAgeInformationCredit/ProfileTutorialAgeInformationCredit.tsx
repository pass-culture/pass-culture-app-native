import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useBonificationBannerVisibility } from 'features/bonification/hooks/useBonificationBannerVisibility'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { BonificationStep } from 'features/profile/components/Tutorial/BonificationStep'
import { BottomInformationStep } from 'features/profile/components/Tutorial/BottomInformationStep'
import { Credit17Step } from 'features/profile/components/Tutorial/Credit17Step'
import { Credit18Step } from 'features/profile/components/Tutorial/Credit18Step'
import { CreditBanner } from 'features/profile/components/Tutorial/CreditBanner'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useBonificationBonusAmount, usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Page } from 'ui/pages/Page'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const headerTitle = 'Comment ça marche\u00a0?'

export const ProfileTutorialAgeInformationCredit = () => {
  const enableHandicapBonification = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_HANDICAP_BONIFICATION
  )
  const enableFamilyQuotientBonification = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_BONIFICATION
  )
  const showCreditBanner = enableHandicapBonification || enableFamilyQuotientBonification
  const { goBack } = useGoBack(...getTabHookConfig('Profile'))
  const { user, isLoggedIn } = useAuthContext()
  const { seventeenYearsOldDeposit, eighteenYearsOldDeposit } = useDepositAmountsByAge()
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const { data: bonificationBonusAmount } = useBonificationBonusAmount()
  const formattedBonificationAmount = formatCurrencyFromCents(
    bonificationBonusAmount,
    currency,
    euroToPacificFrancRate
  )
  const { onScroll, headerTransition } = useOpacityTransition()
  const headerHeight = useGetHeaderHeight()
  const { resetBannerVisibility } = useBonificationBannerVisibility()

  return (
    <Page>
      <StyledScrollView onScroll={onScroll} scrollEventThrottle={16}>
        <Placeholder height={headerHeight} />
        <Container gap={6}>
          <Typo.Title3 {...getHeadingAttrs(1)}>{headerTitle}</Typo.Title3>
          <Typo.BodyS {...getHeadingAttrs(2)}>
            De 17 à 18 ans, le pass Culture offre un crédit à dépenser dans l’application pour des
            activités culturelles.
          </Typo.BodyS>
          <CreditTimelineContainer>
            <Credit17Step amount={seventeenYearsOldDeposit} />
            <Credit18Step amount={eighteenYearsOldDeposit} />
            <BonificationStep
              amount={formattedBonificationAmount}
              user={user}
              isLoggedIn={isLoggedIn}
              resetBannerVisibility={resetBannerVisibility}
              enableHandicapBonification={enableHandicapBonification}
              enableFamilyQuotientBonification={enableFamilyQuotientBonification}
            />
            <BottomInformationStep />
            <CreditBanner enableBonification={showCreditBanner} />
          </CreditTimelineContainer>
        </Container>
      </StyledScrollView>
      <ContentHeader
        headerTitle={headerTitle}
        headerTransition={headerTransition}
        onBackPress={goBack}
      />
    </Page>
  )
}

const Container = styled(ViewGap)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xxl,
  marginBottom: theme.designSystem.size.spacing.xxl,
}))

const CreditTimelineContainer = styled.View({
  flexGrow: 1,
  flexDirection: 'column',
})

const StyledScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: theme.designSystem.size.spacing.xl,
    maxWidth: theme.contentPage.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
}))``

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
