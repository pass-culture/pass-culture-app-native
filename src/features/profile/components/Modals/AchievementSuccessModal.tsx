import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/native'

import { AchievementId } from 'features/profile/pages/Achievements/AchievementData'
import LottieView from 'libs/lottie'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, TypoDS } from 'ui/theme'

import confetti from './confetti.json'

interface Props {
  visible: boolean
  hideModal: () => void
  ids: AchievementId[]
}

export const AchievementSuccessModal = ({ visible, hideModal, ids }: Props) => {
  const confettiRef = useRef<LottieView>(null)
  const logoRef = useRef<LottieView>(null)

  useEffect(() => {
    if (visible) {
      confettiRef.current?.play(0)
      logoRef.current?.play(0, 62)
    }
  }, [visible])

  if (ids.length <= 0) return null

  const severalBadgesUnlocked = ids.length >= 2

  return (
    <AppInformationModal
      title="Félicitations&nbsp;!"
      onCloseIconPress={hideModal}
      visible={visible}>
      <ConfettiView
        ref={confettiRef}
        source={confetti}
        autoPlay={false}
        loop={false}
        resizeMode="cover"
      />
      <Spacer.Column numberOfSpaces={2} />
      <IconsWrapper>
        <BadgeView
          ref={logoRef}
          source={TutorialPassLogo}
          autoPlay={false}
          loop={false}
          resizeMode="cover"
        />
      </IconsWrapper>
      <Spacer.Column numberOfSpaces={2} />
      <TypoDS.Title3>
        {severalBadgesUnlocked
          ? 'Tu as débloqué des succès\u00a0!'
          : 'Tu as débloqué un succès\u00a0!'}
      </TypoDS.Title3>
      <Spacer.Column numberOfSpaces={12} />

      <InternalTouchableLink
        as={ButtonPrimary}
        wording="Accéder à mes succès"
        navigateTo={{ screen: 'Achievements' }}
        onBeforeNavigate={() => {
          hideModal()
        }}
      />

      <Spacer.Column numberOfSpaces={2} />
      <ButtonQuaternaryBlack
        wording="Fermer"
        accessibilityLabel="Fermer la modale"
        icon={Invalidate}
        onPress={hideModal}
      />
    </AppInformationModal>
  )
}

const IconsWrapper = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
})

const ConfettiView = styled(LottieView)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
  pointerEvents: 'none',
})

const BadgeView = styled(LottieView)({
  height: getSpacing(60),
})
