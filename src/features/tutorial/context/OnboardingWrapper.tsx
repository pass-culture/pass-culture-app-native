import React, { memo, useCallback, useContext, useMemo, useState } from 'react'

import { NonEligible, TutorialTypes } from 'features/tutorial/enums'
import { NotEligibleModal } from 'features/tutorial/pages/onboarding/NotEligibleModal'
import { useModal } from 'ui/components/modals/useModal'

interface OnboardingContextValue {
  showNotEligibleModal: (age: NonEligible, type: TutorialTypes) => void
}

const OnboardingContext = React.createContext<OnboardingContextValue>({
  showNotEligibleModal: () => null,
})

interface Props {
  children: React.JSX.Element
}

export const OnboardingWrapper = memo(function OnboardingWrapper({ children }: Props) {
  const { showModal, ...modalProps } = useModal(false)
  const [userStatus, setUserStatus] = useState(NonEligible.UNDER_15)
  const [type, setType] = useState(TutorialTypes.ONBOARDING)

  const showNotEligibleModal = useCallback(
    (userStatus: NonEligible, type: TutorialTypes) => {
      setUserStatus(userStatus)
      setType(type)
      showModal()
    },
    [showModal]
  )

  const value = useMemo(
    () => ({
      showNotEligibleModal,
    }),
    [showNotEligibleModal]
  )

  return (
    <OnboardingContext.Provider value={value}>
      {children}
      <NotEligibleModal userStatus={userStatus} type={type} {...modalProps} />
    </OnboardingContext.Provider>
  )
})

export function useOnboardingContext(): OnboardingContextValue {
  return useContext(OnboardingContext)
}
