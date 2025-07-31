import React, { FunctionComponent, useMemo } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { DepositType, EligibilityType } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { LocationWidget } from 'features/location/components/LocationWidget'
import { LocationWidgetDesktop } from 'features/location/components/LocationWidgetDesktop'
import { ScreenOrigin } from 'features/location/enums'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Separator } from 'ui/components/Separator'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const HomeHeader: FunctionComponent = function () {
  const availableCredit = useAvailableCredit()
  const { isLoggedIn, user } = useAuthContext()
  const { isDesktopViewport } = useTheme()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

  const Header = useMemo(() => {
    const welcomeTitle =
      user?.firstName && isLoggedIn ? `Bonjour ${user.firstName}` : 'Bienvenue\u00a0!'

    const getSubtitle = () => {
      const shouldSeeDefaultSubtitle =
        !isLoggedIn ||
        !user ||
        !user.isBeneficiary ||
        user.eligibility === EligibilityType.free ||
        user.depositType === DepositType.GRANT_FREE ||
        (!user.isBeneficiary && user.isEligibleForBeneficiaryUpgrade)

      if (shouldSeeDefaultSubtitle) return 'Toute la culture à portée de main'

      const shouldSeeBeneficiarySubtitle =
        user.isBeneficiary && !!availableCredit && !availableCredit.isExpired
      if (shouldSeeBeneficiarySubtitle) {
        const credit = formatCurrencyFromCents(
          availableCredit.amount,
          currency,
          euroToPacificFrancRate
        )
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
                <StyledSeparator height={getSpacing(6)} />
                <LocationWidgetDesktop />
              </Title>
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
  }, [user, isLoggedIn, isDesktopViewport, availableCredit, currency, euroToPacificFrancRate])

  return Header
}

const HeaderContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  marginTop: theme.designSystem.size.spacing.xl,
  marginHorizontal: theme.contentPage.marginHorizontal,
  zIndex: theme.zIndex.header,
}))

const TitleContainer = styled.View({
  width: '100%',
})

const Subtitle = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  marginTop: theme.designSystem.size.spacing.xs,
}))

const TitleLabel = styled(Typo.Title1)({
  maxWidth: '70%',
})

const Title = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  zIndex: theme.zIndex.locationWidget,
}))

const StyledSeparator = styled(Separator.Vertical)(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.xl,
  marginRight: theme.designSystem.size.spacing.l,
}))
