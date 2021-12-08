import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { DMSInformation } from 'features/identityCheck/atoms/DMSInformation'
import { IdentityVerificationText } from 'features/identityCheck/atoms/IdentityVerificationText'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { SomeAdviceBeforeIdentityCheckModal } from 'features/identityCheck/components/SomeAdviceBeforeIdentityCheckModal'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useModal } from 'ui/components/modals/useModal'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { Spacer, getSpacing } from 'ui/theme'

export const IdentityCheckStart = () => {
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
            <Spacer.Column numberOfSpaces={10} />
            <BicolorIdCardWithMagnifyingGlass size={getSpacing(36)} />
            <Spacer.Column numberOfSpaces={6} />
            <IdentityVerificationText />
            <Spacer.Column numberOfSpaces={6} />
            <DMSInformation />
          </Container>
        }
        fixedBottomChildren={
          <ButtonPrimary onPress={showModal} title={t`Commencer la vérification`} />
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

const Container = styled.View({ alignItems: 'center' })
