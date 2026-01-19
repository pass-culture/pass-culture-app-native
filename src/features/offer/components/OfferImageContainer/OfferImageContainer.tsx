import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { useSharedValue } from 'react-native-reanimated'
import { useTheme } from 'styled-components/native'

import { CategoryIdEnum, OfferResponseV2 } from 'api/gen'
import { ConsentState, CookieNameEnum } from 'features/cookies/enums'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { OfferImageContainerDimensions } from 'features/offer/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ImageWithCredit } from 'shared/types'
import { SegmentResult } from 'shared/useABSegment/useABSegment'
import { AnchorNames } from 'ui/components/anchor/anchor-name'
import { useScrollToAnchor } from 'ui/components/anchor/AnchorContext'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { OfferImageHeaderWrapper } from './OfferImageHeaderWrapper'
import { OfferImageRenderer } from './OfferImageRenderer'

type Props = {
  categoryId: CategoryIdEnum | null
  imageDimensions: OfferImageContainerDimensions
  offer: OfferResponseV2
  segment: SegmentResult
  images?: ImageWithCredit[]
  onPress?: (defaultIndex?: number) => void
  placeholderImage?: string
  enableVideoABTesting?: boolean
}

export const OfferImageContainer: FunctionComponent<Props> = ({
  images = [],
  onPress,
  categoryId,
  placeholderImage,
  imageDimensions,
  offer,
  segment,
  enableVideoABTesting,
}) => {
  const progressValue = useSharedValue<number>(0)
  const { navigate } = useNavigation<UseNavigationType>()
  const { showInfoSnackBar } = useSnackBarContext()
  const { cookiesConsent } = useCookies()
  const { designSystem } = useTheme()
  const scrollToAnchor = useScrollToAnchor()
  const isVideoSectionEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_OFFER_VIDEO_SECTION)
  const hasConsent =
    cookiesConsent.state === ConsentState.HAS_CONSENT &&
    cookiesConsent.value.accepted.includes(CookieNameEnum.VIDEO_PLAYBACK)

  const hasVideo = offer.video?.id && isVideoSectionEnabled
  const shouldShowVideoSection = enableVideoABTesting ? hasVideo && segment === 'A' : hasVideo

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

  return (
    <OfferImageHeaderWrapper
      imageHeight={imageDimensions.backgroundHeight}
      imageUrl={placeholderImage}
      paddingTop={designSystem.size.spacing.xxl * 4}>
      <OfferImageRenderer
        offerImages={images}
        placeholderImage={placeholderImage}
        progressValue={progressValue}
        onPress={onPress}
        categoryId={categoryId}
        imageDimensions={imageDimensions}
        onSeeVideoPress={shouldShowVideoSection ? handleVideoPress : undefined}
      />
    </OfferImageHeaderWrapper>
  )
}
