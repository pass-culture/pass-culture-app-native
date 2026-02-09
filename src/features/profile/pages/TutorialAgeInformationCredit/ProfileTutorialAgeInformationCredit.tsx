import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { QFBonificationStatus } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useBonificationBannerVisibility } from 'features/bonification/hooks/useBonificationBannerVisibility'
import { BonificationRefusedType } from 'features/bonification/pages/BonificationRefused'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import {
  CreditComponentPropsV3,
  CreditTimelineV3,
} from 'features/onboarding/components/CreditTimelineV3'
import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { BlockDescriptionItem } from 'features/profile/components/Tutorial/BlockDescriptionItem'
import { InformationStepContent } from 'features/profile/components/Tutorial/InformationStepContent'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useBonificationBonusAmount, usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Button } from 'ui/designSystem/Button/Button'
import { ButtonContainerFlexStart } from 'ui/designSystem/Button/ButtonContainerFlexStart'
import { Page } from 'ui/pages/Page'
import { Clock } from 'ui/svg/icons/Clock'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Confirmation } from 'ui/svg/icons/Confirmation'
import { Lock } from 'ui/svg/icons/Lock'
import { Offers } from 'ui/svg/icons/Offers'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { PlainMore } from 'ui/svg/icons/PlainMore'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const ProfileTutorialAgeInformationCredit = () => {
  const { goBack } = useGoBack(...getTabHookConfig('Profile'))
  const { navigate } = useNavigation<UseNavigationType>()
  const { user, isLoggedIn } = useAuthContext()
  const { designSystem } = useTheme()
  const enableBonification = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_BONIFICATION)
  const { onScroll, headerTransition } = useOpacityTransition()
  const headerHeight = useGetHeaderHeight()
  const headerTitle = 'Comment ça marche\u00a0?'
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const { data: bonificationBonusAmount } = useBonificationBonusAmount()
  const formattedBonificationAmount = formatCurrencyFromCents(
    bonificationBonusAmount,
    currency,
    euroToPacificFrancRate
  )
  const bonificationStatus: QFBonificationStatus | null | undefined = user?.qfBonificationStatus
  const bonificationTooManyRetries = user?.remainingBonusAttempts === 0
  const wasBonificationReceived = bonificationStatus === QFBonificationStatus.granted
  const isEligibleToBonification = bonificationStatus !== QFBonificationStatus.not_eligible
  const { resetBannerVisibility } = useBonificationBannerVisibility()

  const getWording = (status: QFBonificationStatus | null | undefined): string => {
    switch (status) {
      case QFBonificationStatus.started:
        return 'En cours de traitement'
      case QFBonificationStatus.granted:
        return 'Bonus obtenu'
      default:
        return 'Vérifier maintenant'
    }
  }
  const getDisabled = (status: QFBonificationStatus | null | undefined): boolean => {
    switch (status) {
      case QFBonificationStatus.started:
      case QFBonificationStatus.granted:
        return true
      default:
        return false
    }
  }

  const bonificationStep: CreditComponentPropsV3 = {
    creditStep: 'optional',
    iconComponent: undefined,
    bonificationStatus: bonificationStatus,
    children: (
      <React.Fragment>
        <RowView>
          <CreditProgressBar progress={1} width="70%" />
          <Typo.BodyAccent style={{ paddingHorizontal: designSystem.size.spacing.s }}>
            +
          </Typo.BodyAccent>
          <CreditProgressBar
            progress={1}
            width="18%"
            innerText={formattedBonificationAmount}
            color={designSystem.color.background.brandSecondary}
          />
        </RowView>
        <Spacer.Column numberOfSpaces={6} />
        <AccessibleUnorderedList
          withPadding
          Separator={<Spacer.Column numberOfSpaces={4} />}
          items={[
            <BlockDescriptionItem
              key={1}
              icon={<SmallLock />}
              text="Tu dois avoir débloqué le crédit de tes 18 ans."
            />,
            <BlockDescriptionItem
              key={2}
              icon={<SmallConfirmation />}
              text="Le bonus dépend des ressources de ton foyer."
            />,
          ]}
        />
        {!isLoggedIn || !isEligibleToBonification || wasBonificationReceived ? null : (
          <StyledButtonContainerFlexStart>
            <Button
              variant="tertiary"
              color="neutral"
              icon={
                bonificationStatus === QFBonificationStatus.started ? ClockFilled : PlainArrowNext
              }
              wording={getWording(bonificationStatus)}
              disabled={getDisabled(bonificationStatus)}
              onPress={() => {
                if (bonificationTooManyRetries) {
                  navigate(
                    ...getSubscriptionHookConfig('BonificationRefused', {
                      bonificationRefusedType: BonificationRefusedType.TOO_MANY_RETRIES,
                    })
                  )
                } else {
                  navigate(...getSubscriptionHookConfig('BonificationExplanations'))
                }
                resetBannerVisibility()
              }}
            />
          </StyledButtonContainerFlexStart>
        )}
      </React.Fragment>
    ),
  }
  const separator: CreditComponentPropsV3 = {
    creditStep: 'separator',
    iconComponent: undefined,
    children: <StyledPlainMore />,
  }

  const stepperProps: CreditComponentPropsV3[] = [
    {
      creditStep: 17,
      children: (
        <React.Fragment>
          <CreditProgressBar progress={0.5} />
          <Spacer.Column numberOfSpaces={4} />
          <BlockDescriptionItem
            icon={<SmallLock />}
            text="Tu as jusqu’à la veille de tes 18 ans pour confirmer ton identité et activer ton crédit."
          />
        </React.Fragment>
      ),
    },
    {
      creditStep: 18,
      children: (
        <React.Fragment>
          <CreditProgressBar progress={1} />
          <Spacer.Column numberOfSpaces={6} />
          <AccessibleUnorderedList
            Separator={<Spacer.Column numberOfSpaces={4} />}
            items={[
              <BlockDescriptionItem
                key={1}
                icon={<SmallLock />}
                text="Tu as jusqu’à la veille de tes 19 ans pour confirmer ton identité et activer ton crédit."
              />,
              <BlockDescriptionItem
                key={2}
                icon={<SmallClock />}
                text="Une fois activé, ton crédit expirera la veille de ton 21ème anniversaire."
              />,
            ]}
            withPadding
          />
        </React.Fragment>
      ),
    },
    {
      creditStep: 'information',
      iconComponent: <GreyOffers />,
      children: (
        <InformationStepContent
          title="Explore tout ce que la culture peut offrir, avec ou sans crédit&nbsp;!"
          subtitle="Tu peux continuer à réserver des offres gratuites autour de chez toi."
        />
      ),
    },
  ]

  if (enableBonification) {
    stepperProps.splice(2, 0, bonificationStep)
    stepperProps.splice(2, 0, separator)
  }

  return (
    <Page>
      <StyledScrollView onScroll={onScroll} scrollEventThrottle={16}>
        <Placeholder height={headerHeight} />
        <Spacer.Column numberOfSpaces={7} />
        <Typo.Title3 numberOfLines={3} {...getHeadingAttrs(1)}>
          {headerTitle}
        </Typo.Title3>
        <Spacer.Column numberOfSpaces={6} />
        <Typo.BodyS numberOfLines={3} {...getHeadingAttrs(2)}>
          De 17 à 18 ans, le pass Culture offre un crédit à dépenser dans l’application pour des
          activités culturelles.
        </Typo.BodyS>
        <Spacer.Column numberOfSpaces={6} />
        <CreditTimelineV3 age={17} stepperProps={stepperProps} testID="seventeen-timeline" />
        <Spacer.Column numberOfSpaces={4} />
        <Banner
          label="Des questions sur ton crédit&nbsp;?"
          description="Les récents ajustements du dispositif peuvent en être la raison."
          links={[
            {
              wording: 'Plus d’infos dans notre FAQ',
              externalNav: { url: env.FAQ_LINK_CREDIT_V3 },
              onBeforeNavigate: () => analytics.logHasClickedTutorialFAQ(),
            },
          ]}
        />
        <Spacer.Column numberOfSpaces={12} />
      </StyledScrollView>
      <ContentHeader
        headerTitle={headerTitle}
        headerTransition={headerTransition}
        onBackPress={goBack}
      />
    </Page>
  )
}

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

const SmallConfirmation = styled(Confirmation).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const SmallLock = styled(Lock).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const SmallClock = styled(Clock).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const GreyOffers = styled(Offers).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.default,
}))``

const RowView = styled.View({
  flexDirection: 'row',
})

const StyledPlainMore = styled(PlainMore).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.icons.sizes.smaller,
}))``

const StyledButtonContainerFlexStart = styled(ButtonContainerFlexStart)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.m,
}))
