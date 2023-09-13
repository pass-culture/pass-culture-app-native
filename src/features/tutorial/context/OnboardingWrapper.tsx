import React, { memo, useCallback, useContext, useMemo, useState } from 'react'

import { NonEligible, TutorialTypes } from 'features/tutorial/enums'
import { NonEligibleModal } from 'features/tutorial/pages/NonEligibleModal'
import { useModal } from 'ui/components/modals/useModal'

interface OnboardingContextValue {
  showNonEligibleModal: (age: NonEligible, type: TutorialTypes) => void
}

const OnboardingContext = React.createContext<OnboardingContextValue>({
  showNonEligibleModal: () => null,
})

interface Props {
  children: React.JSX.Element
}

export const OnboardingWrapper = memo(function OnboardingWrapper({ children }: Props) {
  const { showModal, ...modalProps } = useModal(false)
  const [userStatus, setUserStatus] = useState(NonEligible.UNDER_15)
  const [type, setType] = useState(TutorialTypes.ONBOARDING)

  const showNonEligibleModal = useCallback(
    (userStatus: NonEligible, type: TutorialTypes) => {
      setUserStatus(userStatus)
      setType(type)
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
      <NonEligibleModal userStatus={userStatus} type={type} {...modalProps} />
    </OnboardingContext.Provider>
  )
})

export function useOnboardingContext(): OnboardingContextValue {
  return useContext(OnboardingContext)
}
