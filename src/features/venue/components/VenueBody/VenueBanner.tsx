import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { BannerMetaModel } from 'api/gen'
import { GOOGLE_LOGO } from 'features/venue/components/VenueBody/GoogleLogo'
import { useVenueBackgroundStyle } from 'features/venue/helpers/useVenueBackgroundStyle'
import { Image } from 'libs/resizing-image-on-demand/Image'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Venue } from 'ui/svg/icons/Venue'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

const GOOGLE_LOGO_HEIGHT = 15
const GOOGLE_LOGO_WIDTH = 47

type Props = {
  bannerUrl?: string | null
  bannerMeta?: BannerMetaModel | null
}

export const VenueBanner: React.FC<Props> = ({ bannerUrl, bannerMeta }) => {
  const backgroundStyle = useVenueBackgroundStyle()
  const { is_from_google: isFromGoogle, image_credit: imageCredit } = bannerMeta ?? {
    is_from_google: null,
    image_credit: null,
  }
  const hasGoogleCredit = isFromGoogle && imageCredit

  return (
    <HeaderContainer hasGoogleCredit={hasGoogleCredit}>
      {bannerUrl ? (
        <ViewGap gap={1}>
          <GoogleWatermarkWrapper withGoogleWatermark={!!isFromGoogle}>
            <Image style={backgroundStyle} resizeMode="cover" url={bannerUrl} />
          </GoogleWatermarkWrapper>
          {isFromGoogle && imageCredit ? <CopyrightText>© {imageCredit}</CopyrightText> : null}
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

const HeaderContainer = styled.View<{ hasGoogleCredit: boolean }>(({ hasGoogleCredit }) => ({
  alignItems: 'center',
  marginBottom: hasGoogleCredit ? getSpacing(2) : getSpacing(6),
}))

const GoogleWatermarkWrapper = ({
  withGoogleWatermark,
  children,
}: PropsWithChildren<{
  withGoogleWatermark: boolean
}>) =>
  withGoogleWatermark ? (
    <View>
      {children}
      <StyledLinearGradient />
      <GoogleLogo source={GOOGLE_LOGO} testID="googleWatermark" />
    </View>
  ) : (
    <React.Fragment>{children}</React.Fragment>
  )

const StyledLinearGradient = styled(LinearGradient).attrs({
  useAngle: true,
  angle: 180,
  locations: [0.45, 1],
  colors: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)'],
})(({ theme }) => ({
  height: '100%',
  width: '100%',
  position: 'absolute',
  zIndex: 1,
  borderRadius: theme.isDesktopViewport ? theme.borderRadius.radius : undefined,
}))

const GoogleLogo = styled.Image({
  height: GOOGLE_LOGO_HEIGHT,
  width: GOOGLE_LOGO_WIDTH,
  position: 'absolute',
  left: getSpacing(4),
  bottom: getSpacing(4),
  zIndex: 2,
})

const CopyrightText = styled(TypoDS.BodySemiBoldXs)(({ theme }) => ({
  color: theme.colors.greySemiDark,
  textAlign: 'right',
  marginRight: theme.isMobileViewport ? getSpacing(4) : 0,
}))

const EmptyVenueBackground = styled.View(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.greyLight,
}))

const VenueIcon = styled(Venue).attrs(({ theme }) => ({
  size: getSpacing(30),
  color: theme.colors.greyMedium,
}))``
