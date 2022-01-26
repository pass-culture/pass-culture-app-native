import { t } from '@lingui/macro'
import React from 'react'

import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { SomeAdviceBeforeIdentityCheckModal } from 'features/identityCheck/components/SomeAdviceBeforeIdentityCheckModal'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useModal } from 'ui/components/modals/useModal'

import { IdentityCheckStartContent } from './IdentityCheckStartContent'

export const IdentityCheckStart = () => {
  const { visible, showModal, hideModal } = useModal(false)
  const { navigateToNextScreen } = useIdentityCheckNavigation()
  const { dispatch } = useIdentityCheckContext()
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
        title={t`Identification`}
        onGoBack={onGoBack}
        scrollChildren={<IdentityCheckStartContent />}
        fixedBottomChildren={
          <ButtonPrimary onPress={showModal} wording={t`Commencer la vérification`} />
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
