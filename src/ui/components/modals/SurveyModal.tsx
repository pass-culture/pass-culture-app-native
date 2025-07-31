import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Close } from 'ui/svg/icons/Close'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  title: string
  visible: boolean
  hideModal: () => void
  Icon: React.FC<AccessibleIcon>
  surveyDescription?: string
  surveyUrl?: string
  complementaryDescription?: string
}

export const SurveyModal = ({
  visible,
  hideModal,
  surveyUrl,
  title,
  surveyDescription,
  Icon,
  complementaryDescription,
}: Props) => {
  const theme = useTheme()
  const modalHeader = (
    <ModalHeader
      title={title}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={hideModal}
    />
  )

  return (
    <AppModal
      title={title}
      customModalHeader={modalHeader}
      visible={visible}
      onBackdropPress={hideModal}>
      <ContentContainer gap={getSpacing(2)}>
        {surveyDescription ? <StyledBody>{surveyDescription}</StyledBody> : null}

        <Icon
          color={theme.designSystem.color.background.brandPrimary}
          size={theme.illustrations.sizes.medium}
        />

        {complementaryDescription ? <StyledBody>{complementaryDescription}</StyledBody> : null}

        {surveyUrl ? (
          <ExternalTouchableLink
            onBeforeNavigate={hideModal}
            as={ButtonPrimary}
            icon={ExternalSite}
            wording="Répondre au questionnaire"
            externalNav={{
              url: surveyUrl,
            }}
          />
        ) : null}
      </ContentContainer>
    </AppModal>
  )
}

const StyledBody = styled(Typo.Body)({
  marginHorizontal: getSpacing(4),
  textAlign: 'center',
})

const ContentContainer = styled(ViewGap)({
  marginHorizontal: getSpacing(4),
  alignItems: 'center',
})
