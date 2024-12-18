import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/native'

import { AchievementEnum } from 'api/gen'
import { analytics } from 'libs/analytics'
import LottieView from 'libs/lottie'
import { achievementsModal, modalFactory } from 'libs/modals/modals'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, TypoDS } from 'ui/theme'

import success from './success.json'

interface Props {
  visible: boolean
  hideModal: () => void
  names: AchievementEnum[]
}

modalFactory.add(achievementsModal, ({ params: { names }, close }) => {
  return <AchievementSuccessModal visible hideModal={close} names={names} />
})

export const AchievementSuccessModal = ({ visible, hideModal, names }: Props) => {
  const logoRef = useRef<LottieView>(null)

  useEffect(() => {
    if (visible) {
      analytics.logConsultAchievementsSuccessModal(names)
      logoRef.current?.play(0, 62)
    }
    // The effect should only run when `visible` changes because`names` is intentionally excluded from the dependencies to avoid unnecessary re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  if (!visible) return null

  const severalAchievementsUnlocked = names.length >= 2

  return (
    <AppInformationModal
      title="Félicitations&nbsp;!"
      onCloseIconPress={hideModal}
      visible={visible}>
      <StyledViewGap gap={2}>
        <AchievementView
          ref={logoRef}
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

const StyledTitle = styled(TypoDS.Title3)({
  textAlign: 'center',
})

const AchievementView = styled(LottieView)({
  height: getSpacing(60),
})
