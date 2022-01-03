import { t } from '@lingui/macro'
import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { DMSInformation } from 'features/identityCheck/atoms/DMSInformation'
import { DMSInformationWeb } from 'features/identityCheck/atoms/DMSInformationWeb'
import { IdentityVerificationText } from 'features/identityCheck/atoms/IdentityVerificationText'
import { IdentityVerificationTextWeb } from 'features/identityCheck/atoms/IdentityVerificationTextWeb'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { SomeAdviceBeforeIdentityCheckModal } from 'features/identityCheck/components/SomeAdviceBeforeIdentityCheckModal'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useModal } from 'ui/components/modals/useModal'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { Spacer, getSpacing } from 'ui/theme'

export const IdentityCheckStart = () => {
  const theme = useTheme()
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
            {theme.isMobileViewport ? (
              <React.Fragment>
                <Spacer.Column numberOfSpaces={10} />
                <BicolorIdCardWithMagnifyingGlass size={getSpacing(36)} />
                <Spacer.Column numberOfSpaces={6} />
                <IdentityVerificationText />
                <Spacer.Flex />
                <DMSInformation />
                <Spacer.Column numberOfSpaces={2} />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <BicolorPhonePending size={getSpacing(30)} />
                <Spacer.Column numberOfSpaces={6} />
                <IdentityVerificationTextWeb />
                <Spacer.Column numberOfSpaces={6} />
                <ButtonPrimary onPress={showModal} title={t`Vérification par smartphone`} />
                <Spacer.Column numberOfSpaces={8} />
                <DMSInformationWeb />
                <Spacer.Column numberOfSpaces={6} />
              </React.Fragment>
            )}
          </Container>
        }
        fixedBottomChildren={
          !!theme.isMobileViewport && (
            <ButtonPrimary onPress={showModal} title={t`Commencer la vérification`} />
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
