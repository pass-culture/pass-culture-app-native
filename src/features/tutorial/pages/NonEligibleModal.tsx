import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { openUrl } from 'features/navigation/helpers'
import { NonEligible, TutorialTypes } from 'features/tutorial/enums'
import { getModalInfoForNonEligible } from 'features/tutorial/helpers/getModalInfoForNonEligible'
import { env } from 'libs/environment'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  visible: boolean
  hideModal: () => void
  userStatus: NonEligible
  type: TutorialTypes
}

export const NonEligibleModal = ({ visible, hideModal, userStatus, type }: Props) => {
  const { title, firstParagraph, secondParagraph, withFAQLink, Illustration } =
    getModalInfoForNonEligible(userStatus, type)

  const StyledIllustration = styled(Illustration).attrs(({ theme }) => ({
    size: theme.illustrations.sizes.fullPage,
  }))``

  const onPress = useCallback(() => {
    openUrl(env.FAQ_LINK_CREDIT)
  }, [])

  return (
    <AppInformationModal visible={visible} title={title} onCloseIconPress={hideModal}>
      <Spacer.Column numberOfSpaces={2} />
      <StyledIllustration />
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

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
