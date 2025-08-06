import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/native'

import { AchievementEnum, AchievementResponse } from 'api/gen'
import { useAchievementsMarkAsSeenMutation } from 'features/achievements/queries/useMarkAchievementsAsSeenMutation'
import { analytics } from 'libs/analytics/provider'
import LottieView from 'libs/lottie'
import success from 'ui/animations/achievements_success.json'
import { ThemedStyledLottieView } from 'ui/animations/ThemedStyledLottieView'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  visible: boolean
  hideModal: () => void
  achievementsToShow: AchievementResponse[]
}

const ANIMATION_END_FRAME = 62

export const AchievementSuccessModal = ({ visible, hideModal, achievementsToShow }: Props) => {
  const logoRef = useRef<LottieView | null>(null)
  const { mutate: markAchievementsAsSeen } = useAchievementsMarkAsSeenMutation()

  const achievementNames: AchievementEnum[] = achievementsToShow.map(
    (achievement) => achievement.name
  )
  const achievementIds: number[] = achievementsToShow.map((achievement) => achievement.id)

  useEffect(() => {
    if (visible) {
      analytics.logConsultAchievementsSuccessModal(achievementNames)
      logoRef.current?.play(0, ANIMATION_END_FRAME)
    }
    // The effect should only run when `visible` changes because`names` is intentionally excluded from the dependencies to avoid unnecessary re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  if (!visible || achievementsToShow.length <= 0) return null

  const severalAchievementsUnlocked = achievementsToShow.length >= 2

  const hideModalAndMarkAsSeen = () => {
    markAchievementsAsSeen(achievementIds)
    hideModal()
  }

  return (
    <AppInformationModal
      title="Félicitations&nbsp;!"
      onCloseIconPress={hideModalAndMarkAsSeen}
      visible={visible}>
      <StyledViewGap gap={2}>
        <ThemedStyledLottieView
          ref={logoRef}
          height={getSpacing(60)}
          source={success}
          autoPlay={false}
          loop={false}
          resizeMode="cover"
        />
        <StyledTitle>
          {severalAchievementsUnlocked
            ? 'Tu as débloqué plusieurs succès\u00a0!'
            : 'Tu as débloqué un succès\u00a0!'}
        </StyledTitle>

        <InternalTouchableLink
          as={ButtonPrimary}
          wording="Accéder à mes succès"
          navigateTo={{ screen: 'Achievements', params: { from: 'success' } }}
          onBeforeNavigate={hideModalAndMarkAsSeen}
        />

        <ButtonTertiaryBlack
          wording="Fermer"
          accessibilityLabel="Fermer la modale"
          icon={Invalidate}
          onPress={hideModalAndMarkAsSeen}
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

const StyledTitle = styled(Typo.Title3)({
  textAlign: 'center',
  marginBottom: getSpacing(6),
})
