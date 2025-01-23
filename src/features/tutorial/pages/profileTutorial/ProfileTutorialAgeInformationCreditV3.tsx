import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { CreditTimelineV3 } from 'features/tutorial/components/CreditTimelineV3'
import { BlockDescriptionItem } from 'features/tutorial/components/profileTutorial/BlockDescriptionItem'
import { InformationStepContent } from 'features/tutorial/components/profileTutorial/InformationStepContent'
import { TutorialTypes } from 'features/tutorial/enums'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { ContentHeader } from 'ui/components/headers/ContentHeader'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'
import { BicolorLock } from 'ui/svg/icons/BicolorLock'
import { Offers } from 'ui/svg/icons/Offers'
import { Spacer, TypoDS, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const ProfileTutorialAgeInformationCreditV3: FunctionComponent = () => {
  const { goBack } = useNavigation<UseNavigationType>()
  const { onScroll, headerTransition } = useOpacityTransition()
  const headerHeight = useGetHeaderHeight()
  const headerTitle = 'Comment ça marche\u00a0?'

  return (
    <React.Fragment>
      <StyledScrollView onScroll={onScroll} scrollEventThrottle={16}>
        <Placeholder height={headerHeight} />
        <Spacer.Column numberOfSpaces={7} />
        <TypoDS.Title3 numberOfLines={3} {...getHeadingAttrs(1)}>
          {headerTitle}
        </TypoDS.Title3>
        <Spacer.Column numberOfSpaces={6} />
        <TypoDS.BodyS numberOfLines={3} {...getHeadingAttrs(1)}>
          De 17 à 18 ans, le pass Culture offre un crédit à dépenser dans l’application pour des
          activités culturelles.
        </TypoDS.BodyS>
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
                        text="Tu as 1 an pour confirmer ton identité et activer ce crédit."
                      />,
                      <BlockDescriptionItem
                        key={2}
                        icon={<SmallClock bicolor={false} />}
                        text="Après activation, tu as jusqu’à la veille de tes 21 ans pour utiliser tout ton crédit."
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
                <React.Fragment>
                  <Spacer.Column numberOfSpaces={6} />
                  <InformationStepContent
                    title="Découvre tout ce que la culture a à offrir, avec ou sans crédit&nbsp;!"
                    subtitle="Tu peux continuer à réserver des offres gratuites autour de chez toi."
                  />
                </React.Fragment>
              ),
            },
          ]}
          type={TutorialTypes.PROFILE_TUTORIAL}
          testID="seventeen-timeline"
        />
        <Spacer.Column numberOfSpaces={12} />
      </StyledScrollView>
      <ContentHeader
        headerTitle={headerTitle}
        headerTransition={headerTransition}
        onBackPress={goBack}
      />
    </React.Fragment>
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
  color: theme.colors.greySemiDark,
}))``

const SmallClock = styled(BicolorClock).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.greySemiDark,
}))``

const GreyOffers = styled(Offers).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
}))``
