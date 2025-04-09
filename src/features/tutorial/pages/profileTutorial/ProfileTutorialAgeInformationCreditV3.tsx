import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { CreditTimelineV3 } from 'features/tutorial/components/CreditTimelineV3'
import { BlockDescriptionItem } from 'features/tutorial/components/profileTutorial/BlockDescriptionItem'
import { InformationStepContent } from 'features/tutorial/components/profileTutorial/InformationStepContent'
import { TutorialTypes } from 'features/tutorial/enums'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuaternarySecondary'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Page } from 'ui/pages/Page'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'
import { BicolorLock } from 'ui/svg/icons/BicolorLock'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Offers } from 'ui/svg/icons/Offers'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const ProfileTutorialAgeInformationCreditV3: FunctionComponent = () => {
  const { goBack } = useNavigation<UseNavigationType>()
  const { onScroll, headerTransition } = useOpacityTransition()
  const headerHeight = useGetHeaderHeight()
  const headerTitle = 'Comment ça marche\u00a0?'

  return (
    <Page>
      <StyledScrollView onScroll={onScroll} scrollEventThrottle={16}>
        <Placeholder height={headerHeight} />
        <Spacer.Column numberOfSpaces={7} />
        <Typo.Title3 numberOfLines={3} {...getHeadingAttrs(1)}>
          {headerTitle}
        </Typo.Title3>
        <Spacer.Column numberOfSpaces={6} />
        <Typo.BodyS numberOfLines={3} {...getHeadingAttrs(1)}>
          De 17 à 18 ans, le pass Culture offre un crédit à dépenser dans l’application pour des
          activités culturelles.
        </Typo.BodyS>
        <Spacer.Column numberOfSpaces={6} />
        <CreditTimelineV3
          age={17}
          stepperProps={[
            {
              creditStep: 17,
              children: (
                <React.Fragment>
                  <CreditProgressBar progress={0.5} />
                  <Spacer.Column numberOfSpaces={4} />
                  <BlockDescriptionItem
                    icon={<SmallLock bicolor={false} />}
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
                        icon={<SmallLock bicolor={false} />}
                        text="Tu as jusqu’à la veille de tes 19 ans pour confirmer ton identité et activer ton crédit."
                      />,
                      <BlockDescriptionItem
                        key={2}
                        icon={<SmallClock bicolor={false} />}
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
          ]}
          type={TutorialTypes.PROFILE_TUTORIAL}
          testID="seventeen-timeline"
        />
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

const SmallLock = styled(BicolorLock).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.designSystem.color.icon.subtle,
}))``

const SmallClock = styled(BicolorClock).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.designSystem.color.icon.subtle,
}))``

const GreyOffers = styled(Offers).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
}))``
