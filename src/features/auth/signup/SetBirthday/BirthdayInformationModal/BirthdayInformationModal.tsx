import React from 'react'
import styled from 'styled-components/native'

import { useDepositAmountsByAge } from 'features/auth/api'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { Spacer, Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK as LINE_BREAK } from 'ui/theme/constants'

type Props = {
  visible: boolean
  hideModal: () => void
}

export function BirthdayInformationModal({ visible, hideModal }: Props) {
  const { eighteenYearsOldDeposit, fifteenYearsOldDeposit } = useDepositAmountsByAge()

  const deposit15 = fifteenYearsOldDeposit.replace(' ', '\u00a0')
  const deposit18 = eighteenYearsOldDeposit.replace(' ', '\u00a0')
  const birthdayInformation =
    `Nous avons besoin de connaître ton âge. Entre 15 et 18 ans, tu es éligible à une aide financière progressive allant de ${deposit15} à\u00a0${deposit18}\u00a0offerte par le Gouvernement.` +
    LINE_BREAK +
    'Cette aide sera créditée directement sur ton compte pass Culture.'

  return (
    <AppInformationModal
      title="Pourquoi saisir ma date de naissance\u00a0?"
      numberOfLinesTitle={3}
      visible={visible}
      onCloseIconPress={hideModal}
      testIdSuffix="birthday-information">
      <ModalChildrenContainer>
        <BirthdayCakeIcon />
        <Spacer.Column numberOfSpaces={2} />
        <StyledBody>{birthdayInformation}</StyledBody>
      </ModalChildrenContainer>
    </AppInformationModal>
  )
}

const BirthdayCakeIcon = styled(BirthdayCake).attrs(({ theme }) => ({
  color: theme.colors.primary,
}))``

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const ModalChildrenContainer = styled.View({
  alignItems: 'center',
})
