import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

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
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuaternarySecondary'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Page } from 'ui/pages/Page'
import { Clock } from 'ui/svg/icons/Clock'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Lock } from 'ui/svg/icons/Lock'
import { Offers } from 'ui/svg/icons/Offers'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const ProfileTutorialAgeInformationCredit = () => {
  const { goBack } = useGoBack(...getTabHookConfig('Profile'))
  const { navigate } = useNavigation<UseNavigationType>()
  const { designSystem } = useTheme()

  const enableBonification = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_BONIFICATION)
  console.log({ enableBonification })
  const { onScroll, headerTransition } = useOpacityTransition()
  const headerHeight = useGetHeaderHeight()
  const headerTitle = 'Comment ça marche\u00a0?'

  const bonificationStep: CreditComponentPropsV3 = {
    creditStep: 'optional',
    iconComponent: undefined,
    children: (
      <React.Fragment>
        <View style={{ flexDirection: 'row' }}>
          <CreditProgressBar progress={1} width="70%" />
          <Typo.BodyAccent style={{ paddingHorizontal: getSpacing(2) }}>+</Typo.BodyAccent>
          <CreditProgressBar
            progress={1}
            width="18%"
            innerText="50€"
            color={designSystem.color.background.brandSecondary}
          />
        </View>
        <Spacer.Column numberOfSpaces={6} />
        <AccessibleUnorderedList
          Separator={<Spacer.Column numberOfSpaces={4} />}
          items={[
            <BlockDescriptionItem
              key={1}
              icon={<SmallLock />}
              text="Tu dois avoir débloqué le crédit de tes 18 ans."
            />,
            <BlockDescriptionItem
              key={2}
              icon={<SmallClock />}
              text="Ton éligibilité sera vérifiée à partir des infos de ton parent."
            />,
          ]}
        />
        <ButtonTertiaryPrimary
          icon={PlainArrowNext}
          wording="Tester mon éligibilité"
          onPress={() => navigate(...getSubscriptionHookConfig('BonificationIntroduction'))}
        />
      </React.Fragment>
    ),
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
        <InfoBanner
          message={`Des questions sur ton crédit\u00a0?${LINE_BREAK}Les récents ajustements du dispositif peuvent en être la raison.`}>
          <Spacer.Column numberOfSpaces={2} />
          <ExternalTouchableLink
            as={ButtonQuaternarySecondary}
            externalNav={{ url: env.FAQ_LINK_CREDIT_V3 }}
            wording="Plus d’infos dans notre FAQ"
            icon={ExternalSiteFilled}
            justifyContent="flex-start"
            onBeforeNavigate={() => analytics.logHasClickedTutorialFAQ()}
            inline
          />
        </InfoBanner>
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
    paddingHorizontal: getSpacing(6),
    maxWidth: theme.contentPage.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
}))``

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const SmallLock = styled(Lock).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const SmallClock = styled(Clock).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const GreyOffers = styled(Offers).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.default,
}))``
