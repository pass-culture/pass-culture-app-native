import { t } from '@lingui/macro'
import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { SomeAdviceBeforeIdentityCheckModal } from 'features/identityCheck/components/SomeAdviceBeforeIdentityCheckModal'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useModal } from 'ui/components/modals/useModal'

import { IdentityCheckStartContent } from './IdentityCheckStartContent'
import { IdentityCheckStartContentDesktop } from './IdentityCheckStartContentDesktop'

export const IdentityCheckStart = () => {
  const { isMobileViewport } = useTheme()
  const { visible, showModal, hideModal } = useModal(false)
  const { navigateToNextScreen } = useIdentityCheckNavigation()

  const onPressContinue = () => {
    hideModal()
    navigateToNextScreen()
  }

  return (
    <React.Fragment>
      <PageWithHeader
        title={t`Identification`}
        scrollChildren={
          <Container>
            {isMobileViewport ? (
              <IdentityCheckStartContent />
            ) : (
              <IdentityCheckStartContentDesktop
                showSomeAdviceBeforeIdentityCheckModal={showModal}
              />
            )}
          </Container>
        }
        fixedBottomChildren={
          !!isMobileViewport && (
            <ButtonPrimary onPress={showModal} wording={t`Commencer la vérification`} />
          )
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

const Container = styled.View({ alignItems: 'center', height: '100%' })
