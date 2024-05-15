import React from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  title: string
  visible: boolean
  hideModal: () => void
  Icon: React.FC<AccessibleIcon>
  surveyDescription?: string
  surveyUrl?: string
}

export const SurveyModal = ({
  visible,
  hideModal,
  surveyUrl,
  title,
  surveyDescription,
  Icon,
}: Props) => {
  return (
    <AppInformationModal title={title} visible={visible} onCloseIconPress={hideModal}>
      <Icon />
      <Spacer.Column numberOfSpaces={4} />
      {surveyDescription ? (
        <Container>
          <Typo.Body>{surveyDescription}</Typo.Body>
        </Container>
      ) : null}

      {surveyUrl ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={8} />
          <ExternalTouchableLink
            onBeforeNavigate={hideModal}
            as={ButtonPrimary}
            icon={ExternalSite}
            wording="Répondre au questionnaire"
            externalNav={{
              url: surveyUrl,
            }}
          />
        </React.Fragment>
      ) : null}
    </AppInformationModal>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  textAlign: 'center',
})
