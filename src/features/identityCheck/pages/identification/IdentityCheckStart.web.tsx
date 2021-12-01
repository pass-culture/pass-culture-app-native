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
import { BicolorIdCardWithMagnifyingClass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingClass'
import { Spacer, getSpacing, Typo, ColorsEnum } from 'ui/theme'

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
            <BicolorIdCardWithMagnifyingClass size={getSpacing(30)} />
            <Spacer.Column numberOfSpaces={6} />
            <IdentityVerificationText />
            <Spacer.Column numberOfSpaces={6} />
            <ButtonPrimary onPress={showModal} title={t`Vérification par smartphone`} />
            <Spacer.Column numberOfSpaces={6} />
            <SeparatorContainer>
              <Separator />
              <StyledCaption>{t`ou`}</StyledCaption>
              <Separator />
            </SeparatorContainer>
            <Spacer.Column numberOfSpaces={6} />
            <DMSInformation />
          </Container>
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

const SeparatorContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
})

const Separator = styled.View<{ color?: ColorsEnum }>(({ color }) => ({
  flex: 1,
  height: 2,
  backgroundColor: color ?? ColorsEnum.GREY_MEDIUM,
}))

const StyledCaption = styled(Typo.Caption).attrs({
  color: ColorsEnum.GREY_DARK,
})({
  paddingHorizontal: getSpacing(4),
})
