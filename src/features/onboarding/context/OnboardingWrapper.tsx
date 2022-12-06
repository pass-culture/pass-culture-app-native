import React, { memo, useCallback, useContext, useMemo, useState } from 'react'

import { NonEligibleModal } from 'features/onboarding/pages/NonEligibleModal'
import { NonEligible } from 'features/onboarding/types'
import { useModal } from 'ui/components/modals/useModal'

interface OnboardingContextValue {
  showNonEligibleModal: (modalType: NonEligible) => void
}

const OnboardingContext = React.createContext<OnboardingContextValue>({
  showNonEligibleModal: () => null,
})

export const OnboardingWrapper = memo(function OnboardingWrapper({
  children,
}: {
  children: JSX.Element
}) {
  const { showModal, ...modalProps } = useModal(false)
  const [modalType, setModalType] = useState(NonEligible.UNDER_15)

  const showNonEligibleModal = useCallback(
    (modalType: NonEligible) => {
      setModalType(modalType)
      showModal()
    },
    [showModal]
  )

  const value = useMemo(
    () => ({
      showNonEligibleModal,
    }),
    [showNonEligibleModal]
  )

  return (
    <OnboardingContext.Provider value={value}>
      {children}
      <NonEligibleModal modalType={modalType} {...modalProps} />
    </OnboardingContext.Provider>
  )
})

export function useOnboardingContext(): OnboardingContextValue {
  return useContext(OnboardingContext)
}
