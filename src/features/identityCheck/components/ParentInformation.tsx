import React from 'react'
import styled from 'styled-components/native'

import { ParentInformationModal } from 'features/identityCheck/components/modals/ParentInformationModal'
import { analytics } from 'libs/analytics'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuarternarySecondary'
import { useModal } from 'ui/components/modals/useModal'
import { ParentWithChild } from 'ui/svg/icons/ParentWithChild'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Spacer, Typo, getSpacing } from 'ui/theme'

export const ParentInformation: React.FC = () => {
  const { visible, showModal, hideModal } = useModal(false)

  const openModal = () => {
    analytics.logShowParentInformationModal()
    showModal()
  }

  return (
    <GreyContainer>
      <StyledParentWithChild />
      <Spacer.Column numberOfSpaces={2} />
      <StyledTitle>{'Accompagnement parental'}</StyledTitle>
      <Spacer.Column numberOfSpaces={2} />
      <StyledDescription>
        {'Obtenez quelques conseils pour inscrire votre enfant sur le pass Culture'}
      </StyledDescription>
      <Spacer.Column numberOfSpaces={2} />
      <ButtonQuaternarySecondary
        wording="En savoir plus"
        icon={PlainArrowNext}
        onPress={openModal}
      />
      <ParentInformationModal isVisible={visible} hideModal={hideModal} />
    </GreyContainer>
  )
}

const GreyContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
  borderRadius: theme.borderRadius.radius,
  alignItems: 'center',
  padding: getSpacing(4),
}))

const StyledTitle = styled(Typo.Caption)({})

const StyledDescription = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
  textAlign: 'center',
}))

const StyledParentWithChild = styled(ParentWithChild).attrs(({ theme }) => ({
  color: theme.colors.greyDark,
  size: theme.illustrations.sizes.small,
}))``
