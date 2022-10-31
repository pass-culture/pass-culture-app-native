import React from 'react'

import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { SomeAdviceBeforeIdentityCheckModal } from 'features/identityCheck/components/SomeAdviceBeforeIdentityCheckModal'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useSubscriptionNavigation } from 'features/identityCheck/useSubscriptionNavigation'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useModal } from 'ui/components/modals/useModal'

import { IdentityCheckStartContent } from './IdentityCheckStartContent'

export const IdentityCheckStart = () => {
  const { visible, showModal, hideModal } = useModal(false)
  const { navigateToNextScreen } = useSubscriptionNavigation()
  const { dispatch } = useSubscriptionContext()
  const { goBack } = useGoBack(...homeNavConfig)

  const onPressContinue = () => {
    hideModal()
    navigateToNextScreen()
  }

  const onGoBack = () => {
    dispatch({ type: 'SET_METHOD', payload: null })
    goBack()
  }

  return (
    <React.Fragment>
      <PageWithHeader
        title="Identification"
        onGoBack={onGoBack}
        scrollChildren={<IdentityCheckStartContent />}
        fixedBottomChildren={
          <ButtonPrimary onPress={showModal} wording="Commencer la vérification" />
        }
      />
      <SomeAdviceBeforeIdentityCheckModal
        visible={visible}
        hideModal={hideModal}
        onPressContinue={onPressContinue}
      />
    </React.Fragment>
  )
}
