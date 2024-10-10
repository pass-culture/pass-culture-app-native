import React, { FunctionComponent, useMemo } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { LocationWidget } from 'features/location/components/LocationWidget'
import { LocationWidgetDesktop } from 'features/location/components/LocationWidgetDesktop'
import { ScreenOrigin } from 'features/location/enums'
import { isUserBeneficiary } from 'features/profile/helpers/isUserBeneficiary'
import { formatToFrenchDecimal } from 'libs/parsers/getDisplayPrice'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Separator } from 'ui/components/Separator'
import { getSpacing, Spacer, Typo, TypoDS } from 'ui/theme'

export const HomeHeader: FunctionComponent = function () {
  const availableCredit = useAvailableCredit()
  const { isLoggedIn, user } = useAuthContext()
  const { isDesktopViewport } = useTheme()

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
        {isDesktopViewport ? null : <LocationWidget screenOrigin={ScreenOrigin.HOME} />}
      </PageHeader>
    )
  }, [user, isLoggedIn, isDesktopViewport, availableCredit])

  return Header
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

const TitleLabel = styled(TypoDS.Title1)({
  maxWidth: '70%',
})

const Title = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
