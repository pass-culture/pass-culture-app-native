import colorAlpha from 'color-alpha'
import React, { PropsWithChildren } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled, { useTheme } from 'styled-components/native'

import { BannerMetaModel } from 'api/gen'
import { GOOGLE_LOGO } from 'features/venue/components/VenueBody/GoogleLogo'
import { useVenueBackgroundStyle } from 'features/venue/helpers/useVenueBackgroundStyle'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { Image } from 'libs/resizing-image-on-demand/Image'
import { getComputedAccessibilityLabel } from 'shared/accessibility/getComputedAccessibilityLabel'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Venue } from 'ui/svg/icons/Venue'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const GOOGLE_LOGO_HEIGHT = 15
const GOOGLE_LOGO_WIDTH = 47

type Props = {
  bannerUrl?: string | null
  bannerMeta?: BannerMetaModel | null
  handleImagePress?: VoidFunction
}

export const VenueBanner: React.FC<Props> = ({ handleImagePress, bannerUrl, bannerMeta }) => {
  const backgroundStyle = useVenueBackgroundStyle()
  const { isMobileViewport, designSystem } = useTheme()
  const { is_from_google: isFromGoogle, image_credit: imageCredit } = bannerMeta ?? {
    is_from_google: null,
    image_credit: null,
  }
  const hasGoogleCredit = isFromGoogle && imageCredit
  const defaultMarginBottom = isMobileViewport ? designSystem.size.spacing.xl : undefined

  const currentCreditText = imageCredit ? `© ${imageCredit}` : undefined
  const computedAccessibilityLabel = getComputedAccessibilityLabel(
    'Voir l’illustration en plein écran',
    currentCreditText
  )

  return (
    <HeaderContainer hasGoogleCredit={!!hasGoogleCredit} defaultMarginBottom={defaultMarginBottom}>
      {bannerUrl ? (
        <ViewGap gap={1}>
          <GoogleWatermarkWrapper
            withGoogleWatermark={!!isFromGoogle}
            handleImagePress={handleImagePress}
            accessibilityLabel={computedAccessibilityLabel}>
            <Image style={backgroundStyle} resizeMode="cover" url={bannerUrl} />
          </GoogleWatermarkWrapper>
          {hasGoogleCredit ? <CopyrightText>{currentCreditText}</CopyrightText> : null}
        </ViewGap>
      ) : (
        <EmptyVenueBackground style={backgroundStyle} testID="defaultVenueBackground">
          <Spacer.TopScreen />
          <VenueIcon />
        </EmptyVenueBackground>
      )}
    </HeaderContainer>
  )
}

const HeaderContainer = styled.View<{ hasGoogleCredit: boolean; defaultMarginBottom?: number }>(
  ({ hasGoogleCredit, defaultMarginBottom, theme }) => ({
    alignItems: 'center',
    marginBottom:
      hasGoogleCredit && theme.isMobileViewport
        ? theme.designSystem.size.spacing.s
        : defaultMarginBottom,
  })
)

const GoogleWatermarkWrapper = ({
  withGoogleWatermark,
  accessibilityLabel,
  handleImagePress,
  children,
}: PropsWithChildren<{
  withGoogleWatermark: boolean
  accessibilityLabel?: string
  handleImagePress?: VoidFunction
}>) =>
  withGoogleWatermark ? (
    <TouchableOpacity
      onPress={handleImagePress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={AccessibilityRole.BUTTON}>
      {children}
      <StyledLinearGradient />
      <GoogleLogo source={GOOGLE_LOGO} testID="googleWatermark" />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={handleImagePress}
      testID="venueImage"
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={AccessibilityRole.BUTTON}>
      {children}
    </TouchableOpacity>
  )

const StyledLinearGradient = styled(LinearGradient).attrs<{ colors?: string[] }>(({ theme }) => ({
  useAngle: true,
  angle: 180,
  locations: [0.45, 1],
  colors: [
    colorAlpha(theme.designSystem.color.background.lockedInverted, 0),
    colorAlpha(theme.designSystem.color.background.lockedInverted, 0.5),
  ],
}))(({ theme }) => ({
  height: '100%',
  width: '100%',
  position: 'absolute',
  zIndex: 1,
  borderRadius: theme.isDesktopViewport ? theme.designSystem.size.borderRadius.m : undefined,
}))

const GoogleLogo = styled.Image(({ theme }) => ({
  height: GOOGLE_LOGO_HEIGHT,
  width: GOOGLE_LOGO_WIDTH,
  position: 'absolute',
  left: theme.designSystem.size.spacing.l,
  bottom: theme.designSystem.size.spacing.l,
  zIndex: 2,
}))

const CopyrightText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  textAlign: 'right',
  marginRight: theme.isMobileViewport ? theme.designSystem.size.spacing.l : 0,
}))

const EmptyVenueBackground = styled.View(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.designSystem.color.background.subtle,
}))

const VenueIcon = styled(Venue).attrs(({ theme }) => ({
  size: getSpacing(30),
  color: theme.designSystem.color.icon.subtle,
}))``
