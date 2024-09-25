import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components/native'

import { AchievementSuccessModal } from 'features/profile/components/Modals/AchievementSuccessModal'
import LottieView from 'libs/lottie'
import { useModal } from 'ui/components/modals/useModal'

import confetti from './confetti.json'

interface AchievementContextValue {
  showAchievementModal: (id: string) => void
}

const AchievementModalContext = React.createContext<AchievementContextValue | undefined>(undefined)

export const AchievementModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const { showModal, ...achievementModalProps } = useModal(false)
  const [id, setId] = useState<string | null>(null)

  const confettiRef = useRef<LottieView>(null)

  function triggerConfetti() {
    confettiRef.current?.play(0)
  }

  const showAchievementModal = useCallback(
    (id: string) => {
      triggerConfetti()
      showModal()
      setId(id)
    },
    [showModal]
  )

  const value = useMemo(() => ({ showAchievementModal }), [showAchievementModal])

  return (
    <AchievementModalContext.Provider value={value}>
      {children}
      {id ? (
        <React.Fragment>
          <AchievementSuccessModal {...achievementModalProps} id={id} />
        </React.Fragment>
      ) : null}
      <StyledLottieView
        ref={confettiRef}
        source={confetti}
        autoPlay={false}
        loop={false}
        resizeMode="cover"
      />
    </AchievementModalContext.Provider>
  )
}

export function useAchievementModalContext(): AchievementContextValue {
  const context = useContext(AchievementModalContext)
  if (!context) {
    throw new Error('useAchievementModalContext must be used within a AchievementModalProvider')
  }
  return context
}

const StyledLottieView = styled(LottieView)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
  pointerEvents: 'none',
})
