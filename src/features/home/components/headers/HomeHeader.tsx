import React, { FunctionComponent, useMemo } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { BannerName } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHomeBanner } from 'features/home/api/useHomeBanner'
import { ActivationBanner } from 'features/home/components/banners/ActivationBanner'
import { SignupBanner } from 'features/home/components/banners/SignupBanner'
import { LocationWidget } from 'features/location/components/LocationWidget'
import { LocationWidgetDesktop } from 'features/location/components/LocationWidgetDesktop'
import { ScreenOrigin } from 'features/location/enums'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { isUserBeneficiary } from 'features/profile/helpers/isUserBeneficiary'
import { useLocation } from 'libs/location'
import { formatToFrenchDecimal } from 'libs/parsers/getDisplayPrice'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Separator } from 'ui/components/Separator'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const HomeHeader: FunctionComponent = function () {
  const availableCredit = useAvailableCredit()
  const { isLoggedIn, user } = useAuthContext()
  const { hasGeolocPosition } = useLocation()
  const { data } = useHomeBanner(hasGeolocPosition)
  const homeBanner = data?.banner
  const { isDesktopViewport } = useTheme()

  // we distinguish three different cases:
  // - not connected OR eligible-to-credit users
  // - beneficiary users
  // - ex-beneficiary users

  const Banner = useMemo(() => {
    if (!isLoggedIn)
      return (
        <BannerContainer>
          <SignupBanner />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.activation_banner)
      return (
        <BannerContainer>
          <ActivationBanner
            title={homeBanner.title}
            subtitle={homeBanner.text}
            icon={BicolorUnlock}
            from={StepperOrigin.HOME}
          />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.retry_identity_check_banner)
      return (
        <BannerContainer>
          <ActivationBanner
            title={homeBanner.title}
            subtitle={homeBanner.text}
            icon={ArrowAgain}
            from={StepperOrigin.HOME}
          />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.transition_17_18_banner)
      return (
        <BannerContainer>
          <ActivationBanner
            title={homeBanner.title}
            subtitle={homeBanner.text}
            icon={BirthdayCake}
            from={StepperOrigin.HOME}
          />
        </BannerContainer>
      )

    return null
  }, [isLoggedIn, homeBanner])

  const Header = useMemo(() => {
    const welcomeTitle =
      user?.firstName && isLoggedIn ? `Bonjour ${user.firstName}` : 'Bienvenue\u00a0!'

    const getSubtitle = () => {
      const shouldSeeDefaultSubtitle =
        !isLoggedIn || !user || !isUserBeneficiary(user) || user.isEligibleForBeneficiaryUpgrade
      if (shouldSeeDefaultSubtitle) return 'Toute la culture à portée de main'

      const shouldSeeBeneficiarySubtitle =
        isUserBeneficiary(user) && !!availableCredit && !availableCredit.isExpired
      if (shouldSeeBeneficiarySubtitle) {
        const credit = formatToFrenchDecimal(availableCredit.amount)
        return `Tu as ${credit} sur ton pass`
      }
      return 'Ton crédit est expiré'
    }
    if (isDesktopViewport) {
      return (
        <React.Fragment>
          <Spacer.TopScreen />
          <HeaderContainer>
            <TitleContainer>
              <Title testID="web-location-widget">
                <TitleLabel numberOfLines={1}>{welcomeTitle}</TitleLabel>
                <Spacer.Row numberOfSpaces={6} />
                <Separator.Vertical height={getSpacing(6)} />
                <Spacer.Row numberOfSpaces={4} />
                <LocationWidgetDesktop />
              </Title>
              <Spacer.Column numberOfSpaces={1} />
              <Subtitle>{getSubtitle()}</Subtitle>
            </TitleContainer>
          </HeaderContainer>
        </React.Fragment>
      )
    }
    return (
      <PageHeader title={welcomeTitle} subtitle={getSubtitle()} numberOfLines={2}>
        {!isDesktopViewport ? <LocationWidget screenOrigin={ScreenOrigin.HOME} /> : null}
      </PageHeader>
    )
  }, [user, isLoggedIn, isDesktopViewport, availableCredit])

  return (
    <React.Fragment>
      {Header}
      <PageContent>
        <Spacer.Column numberOfSpaces={6} />
        {Banner}
      </PageContent>
    </React.Fragment>
  )
}

const HeaderContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  marginTop: getSpacing(6),
  marginHorizontal: theme.contentPage.marginHorizontal,
  zIndex: theme.zIndex.header,
}))

const TitleContainer = styled.View({
  width: '100%',
})
const Subtitle = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const TitleLabel = styled(Typo.Title1)({
  maxWidth: '70%',
})

const Title = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const PageContent = styled.View({
  marginHorizontal: getSpacing(6),
})

const BannerContainer = styled.View({
  marginBottom: getSpacing(8),
})
