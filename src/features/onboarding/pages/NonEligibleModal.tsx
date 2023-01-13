import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { StyledBody } from 'features/auth/pages/signup/underageSignup/notificationPagesStyles'
import { openUrl } from 'features/navigation/helpers'
import { getModalInfoForNonEligible } from 'features/onboarding/helpers/getModalInfoForNonEligible'
import { NonEligible } from 'features/onboarding/types'
import { env } from 'libs/environment'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { BicolorBirthdayCake } from 'ui/svg/icons/BicolorBirthdayCake'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer } from 'ui/theme'

type Props = {
  visible: boolean
  hideModal: () => void
  modalType: NonEligible
}

export const NonEligibleModal = ({ visible, hideModal, modalType }: Props) => {
  const { title, firstParagraph, secondParagraph, withFAQLink } =
    getModalInfoForNonEligible(modalType)

  const onPress = useCallback(() => {
    openUrl(env.FAQ_LINK_CREDIT)
  }, [])

  return (
    <AppInformationModal visible={visible} title={title} onCloseIconPress={hideModal}>
      <Spacer.Column numberOfSpaces={2} />
      <BirthdayCake />
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>{firstParagraph}</StyledBody>
      {!!withFAQLink && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <ButtonTertiaryBlack
            wording="comment ça marche&nbsp;?"
            icon={ExternalSiteFilled}
            onPress={onPress}
          />
        </React.Fragment>
      )}
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>{secondParagraph}</StyledBody>
      <Spacer.Column numberOfSpaces={8} />
      <ButtonPrimary onPress={hideModal} wording={'Explorer l’application'} />
    </AppInformationModal>
  )
}

const BirthdayCake = styled(BicolorBirthdayCake).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``
