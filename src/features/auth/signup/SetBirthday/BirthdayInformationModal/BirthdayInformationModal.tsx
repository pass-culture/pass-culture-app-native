import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useDepositAmountsByAge } from 'features/auth/api'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  visible: boolean
  hideModal: () => void
}

const LINE_BREAK = '\n' + '\n'
const SPACE = ' '

export function BirthdayInformationModal({ visible, hideModal }: Props) {
  const { eighteenYearsOldDeposit, fifteenYearsOldDeposit } = useDepositAmountsByAge()

  const birthdayInformation =
    t`Nous avons besoin de connaître ton âge. ` +
    SPACE +
    t({
      id: 'financialHelpMessage',
      values: {
        deposit15: fifteenYearsOldDeposit.replace(' ', '\u00a0'),
        deposit18: eighteenYearsOldDeposit.replace(' ', '\u00a0'),
      },
      message:
        'Entre 15 et 18 ans, tu es éligible à une aide financière progressive allant de {deposit15} à\u00a0{deposit18}\u00a0offerte par le Gouvernement.',
    }) +
    LINE_BREAK +
    t`Cette aide sera créditée directement sur ton compte pass Culture.`

  return (
    <AppInformationModal
      title={t`Pourquoi saisir ma date de naissance\u00a0?`}
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
  paddingTop: getSpacing(5),
  alignItems: 'center',
})
