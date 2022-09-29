import React from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen'
import { formatToFrenchDecimal } from 'libs/parsers/getDisplayPrice'
import { BulletListItem } from 'ui/components/BulletListItem'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { VerticalUl } from 'ui/components/Ul'
import { Typo } from 'ui/theme'

type Props = {
  domainsCredit: DomainsCredit
  visible: boolean
  hideModal: () => void
}

const CreditText = ({ domainsCredit }: Pick<Props, 'domainsCredit'>) => {
  const digitalCeiling = domainsCredit.digital
    ? formatToFrenchDecimal(domainsCredit.digital.initial)
    : ''
  const physicalCeiling = domainsCredit.physical
    ? formatToFrenchDecimal(domainsCredit.physical.initial)
    : ''

  return physicalCeiling ? (
    <Wrapper testID="creditTextWithPhysicalCeiling">
      <StyledBulletListItem text="tout ton crédit en sorties&nbsp;: festival, concert, cinéma..." />
      <StyledBulletListItem
        text={`maximum ${digitalCeiling} en offres numériques\u00a0: presse en ligne, plateforme de streaming...`}
      />
      <StyledBulletListItem
        text={`maximum ${physicalCeiling} en offres physiques\u00a0: livre, instrument de musique...`}
      />
    </Wrapper>
  ) : (
    <Wrapper testID="creditText">
      <StyledBulletListItem text="tout ton crédit pour les offres physiques&nbsp;: livre, instrument de musique..." />
      <StyledBulletListItem text="tout ton crédit pour les sorties&nbsp;: festival, concert, cinéma..." />
      <StyledBulletListItem
        text={`maximum ${digitalCeiling} en offres numériques\u00a0: presse en ligne, plateforme de streaming...`}
      />
    </Wrapper>
  )
}

export function CreditCeilingsModal({ domainsCredit, visible, hideModal }: Props) {
  return (
    <AppInformationModal
      title="Pourquoi cette limite&nbsp;?"
      numberOfLinesTitle={2}
      visible={visible}
      onCloseIconPress={hideModal}
      testIdSuffix="credit-ceiling-information">
      <ModalChildrenContainer>
        <Typo.Body>
          Pour faire le plein de culture et rencontrer ceux qui la font vivre, tu peux
          dépenser&nbsp;:
        </Typo.Body>
        <CreditText domainsCredit={domainsCredit} />
      </ModalChildrenContainer>
    </AppInformationModal>
  )
}

const Wrapper = Platform.OS === 'web' ? VerticalUl : View

const ModalChildrenContainer = styled.View({
  alignItems: 'center',
})

const StyledBulletListItem = styled(BulletListItem).attrs({
  spacing: 5,
})``
