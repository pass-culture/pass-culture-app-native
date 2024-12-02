import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/native'

import { AchievementId } from 'features/profile/pages/Achievements/AchievementData'
import { analytics } from 'libs/analytics'
import LottieView from 'libs/lottie'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
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
      analytics.logConsultAchievementsSuccessModal(ids)
      confettiRef.current?.play(0)
      logoRef.current?.play(0, 62)
    }
    // The effect should only run when `visible` changes because`ids` is intentionally excluded from the dependencies to avoid unnecessary re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  if (!visible || ids.length <= 0) return null

  const severalBadgesUnlocked = ids.length >= 2

  return (
    <AppInformationModal
      title="Félicitations&nbsp;!"
      onCloseIconPress={hideModal}
      visible={visible}>
      <StyledViewGap gap={2}>
        <ConfettiView
          ref={confettiRef}
          source={confetti}
          autoPlay={false}
          loop={false}
          resizeMode="cover"
        />

        <BadgeView
          ref={logoRef}
          source={TutorialPassLogo}
          autoPlay={false}
          loop={false}
          resizeMode="cover"
        />
        <TypoDS.Title3>
          {severalBadgesUnlocked
            ? 'Tu as débloqué des succès\u00a0!'
            : 'Tu as débloqué un succès\u00a0!'}
        </TypoDS.Title3>
        <Spacer.Column numberOfSpaces={6} />

        <InternalTouchableLink
          as={ButtonPrimary}
          wording="Accéder à mes succès"
          navigateTo={{ screen: 'Achievements', params: { from: 'success' } }}
          onBeforeNavigate={() => {
            hideModal()
          }}
        />

        <ButtonTertiaryBlack
          wording="Fermer"
          accessibilityLabel="Fermer la modale"
          icon={Invalidate}
          onPress={hideModal}
        />
      </StyledViewGap>
    </AppInformationModal>
  )
}

const StyledViewGap = styled(ViewGap)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  maxWidth: theme.contentPage.maxWidth,
}))

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
