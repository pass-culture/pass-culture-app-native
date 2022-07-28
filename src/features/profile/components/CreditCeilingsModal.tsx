import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen'
import { formatToFrenchDecimal } from 'libs/parsers/getDisplayPrice'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  domainsCredit: DomainsCredit
  visible: boolean
  hideModal: () => void
}

const LINE_BREAK = '\n\n'
const SPACE = ' '

const CreditText = ({ domainsCredit }: Pick<Props, 'domainsCredit'>) => {
  const totalCeiling = formatToFrenchDecimal(domainsCredit.all.initial)
  const digitalCeiling = domainsCredit.digital
    ? formatToFrenchDecimal(domainsCredit.digital.initial)
    : ''
  const physicalCeiling = domainsCredit.physical
    ? formatToFrenchDecimal(domainsCredit.physical.initial)
    : ''

  return physicalCeiling ? (
    <Typo.Body testID="creditTextWithPhysicalCeiling">
      <Typo.ButtonText>{t`${totalCeiling} en sorties` + SPACE}</Typo.ButtonText>
      {t`mais` + SPACE}
      <Typo.ButtonText>{t`${digitalCeiling} maximum en biens numériques` + SPACE}</Typo.ButtonText>
      {t`(presse en ligne, plateformes de streaming...) et` + SPACE}
      <Typo.ButtonText>{t`${physicalCeiling} maximum en biens physiques` + SPACE}</Typo.ButtonText>
      {t`(livres, instruments de musique...).`}
    </Typo.Body>
  ) : (
    <Typo.Body testID="creditText">
      <Typo.ButtonText>{t`${totalCeiling} en biens physiques` + SPACE}</Typo.ButtonText>
      {t`mais` + SPACE}
      <Typo.ButtonText>{t`${digitalCeiling} maximum en biens numériques` + SPACE}</Typo.ButtonText>
      {t`(presse en ligne, plateformes de streaming...).`}
    </Typo.Body>
  )
}

export function CreditCeilingsModal({ domainsCredit, visible, hideModal }: Props) {
  return (
    <AppInformationModal
      title={t`Pourquoi cette limite\u00a0?`}
      numberOfLinesTitle={2}
      visible={visible}
      onCloseIconPress={hideModal}
      testIdSuffix="credit-ceiling-information">
      <ModalChildrenContainer>
        <Spacer.Column numberOfSpaces={2} />
        <StyledBody>
          {t`Il est possible de dépenser jusqu’à` + SPACE}
          <CreditText domainsCredit={domainsCredit} />
          {LINE_BREAK + t`Cette limite a pour but d’encourager la` + SPACE}
          <Typo.ButtonText>{t`diversification des pratiques culturelles.`}</Typo.ButtonText>
        </StyledBody>
      </ModalChildrenContainer>
    </AppInformationModal>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const ModalChildrenContainer = styled.View({
  paddingTop: getSpacing(5),
  alignItems: 'center',
})
