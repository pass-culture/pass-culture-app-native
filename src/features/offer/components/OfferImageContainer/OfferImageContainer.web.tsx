import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, PropsWithChildren, useRef } from 'react'
import { useSharedValue } from 'react-native-reanimated'
import styled, { useTheme } from 'styled-components/native'

import { CategoryIdEnum, OfferResponseV2 } from 'api/gen'
import { ConsentState, CookieNameEnum } from 'features/cookies/enums'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { OfferImageRenderer } from 'features/offer/components/OfferImageContainer/OfferImageRenderer'
import { OfferImageContainerDimensions } from 'features/offer/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { ImageWithCredit } from 'shared/types'
import { AnchorNames } from 'ui/components/anchor/anchor-name'
import { useScrollToAnchor } from 'ui/components/anchor/AnchorContext'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { OfferImageHeaderWrapper } from './OfferImageHeaderWrapper'

type Props = {
  categoryId: CategoryIdEnum | null
  imageDimensions: OfferImageContainerDimensions
  offer: OfferResponseV2
  images?: ImageWithCredit[]
  onPress?: (defaultIndex?: number) => void
  placeholderImage?: string
}

export const OfferImageContainer: FunctionComponent<Props> = ({
  images = [],
  onPress,
  categoryId,
  placeholderImage,
  imageDimensions,
  offer,
}) => {
  const { isDesktopViewport, designSystem } = useTheme()
  const headerHeight = useGetHeaderHeight()

  const progressValue = useSharedValue<number>(0)

  const { navigate } = useNavigation<UseNavigationType>()
  const { showInfoSnackBar } = useSnackBarContext()
  const { cookiesConsent } = useCookies()
  const scrollToAnchor = useScrollToAnchor()
  const isVideoSectionEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_OFFER_VIDEO_SECTION)
  const hasConsent =
    cookiesConsent.state === ConsentState.HAS_CONSENT &&
    cookiesConsent.value.accepted.includes(CookieNameEnum.VIDEO_PLAYBACK)

  const hasVideo = offer.video?.id && isVideoSectionEnabled

  const handleVideoPress = () => {
    if (!hasConsent) {
      showInfoSnackBar({
        message:
          'Pour lire la vidéo, tu dois accepter les cookies vidéo depuis ton profil dans la partie “Confidentialité"',
        timeout: SNACK_BAR_TIME_OUT,
      })
      scrollToAnchor(AnchorNames.VIDEO_PLAYBACK)
      return
    }

    navigate('OfferVideoPreview', { id: offer.id })
  }

  const Wrapper = useRef(({ children }: PropsWithChildren) =>
    isDesktopViewport ? (
      <React.Fragment>{children}</React.Fragment>
    ) : (
      <OfferImageHeaderWrapper
        imageHeight={imageDimensions.backgroundHeight}
        imageUrl={placeholderImage}
        paddingTop={designSystem.size.spacing.xxl * 4}>
        {children}
      </OfferImageHeaderWrapper>
    )
  ).current

  return (
    <Wrapper>
      <StyledOfferImageRenderer
        offerImages={images}
        headerHeight={headerHeight}
        placeholderImage={placeholderImage}
        progressValue={progressValue}
        onPress={onPress}
        categoryId={categoryId}
        imageDimensions={imageDimensions}
        onSeeVideoPress={hasVideo ? handleVideoPress : undefined}
      />
    </Wrapper>
  )
}

const StyledOfferImageRenderer = styled(OfferImageRenderer)<{
  headerHeight: number
}>(({ headerHeight, theme }) => ({
  ...(theme.isDesktopViewport && !theme.isNative
    ? { position: 'sticky', top: 48 + headerHeight, alignSelf: 'flex-start' }
    : {}),
}))
