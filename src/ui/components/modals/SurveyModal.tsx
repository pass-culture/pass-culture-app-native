import React from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer } from 'ui/theme'

type Props = {
  title: string
  visible: boolean
  hideModal: () => void
  surveyUrl: string
  Icon: React.FC<AccessibleIcon>
  Content?: React.FC
}

export const SurveyModal = ({ visible, hideModal, surveyUrl, title, Content, Icon }: Props) => {
  return (
    <AppInformationModal title={title} visible={visible} onCloseIconPress={hideModal}>
      <Icon />
      <Spacer.Column numberOfSpaces={4} />
      {!!Content && (
        <Container>
          <Content />
        </Container>
      )}
      <Spacer.Column numberOfSpaces={8} />
      <ExternalTouchableLink
        as={ButtonPrimary}
        icon={ExternalSite}
        wording="Répondre au questionnaire"
        externalNav={{
          url: surveyUrl,
        }}
      />
    </AppInformationModal>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  textAlign: 'center',
})