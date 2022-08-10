import { t } from '@lingui/macro'
import React, { useEffect } from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen'
import { analytics } from 'libs/firebase/analytics'
import { formatToFrenchDecimal } from 'libs/parsers/getDisplayPrice'
import { BulletListItem } from 'ui/components/BulletListItem'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { Typo } from 'ui/theme'
import { VerticalUl } from 'ui/web/list/Ul'

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
      <StyledBulletListItem
        text={t`tout ton crédit en sorties\u00a0: festival, concert, cinéma...`}
      />
      <StyledBulletListItem
        text={t`maximum ${digitalCeiling} en offres numériques\u00a0: presse en ligne, plateforme de streaming...`}
      />
      <StyledBulletListItem
        text={t`maximum ${physicalCeiling} en offres physiques\u00a0: livre, instrument de musique...`}
      />
    </Wrapper>
  ) : (
    <Wrapper testID="creditText">
      <StyledBulletListItem
        text={t`tout ton crédit pour les offres physiques\u00a0: livre, instrument de musique...`}
      />
      <StyledBulletListItem
        text={t`tout ton crédit pour les sorties\u00a0: festival, concert, cinéma...`}
      />
      <StyledBulletListItem
        text={t`maximum ${digitalCeiling} en offres numériques\u00a0: presse en ligne, plateforme de streaming...`}
      />
    </Wrapper>
  )
}

export function CreditCeilingsModal({ domainsCredit, visible, hideModal }: Props) {
  useEffect(() => {
    analytics.logConsultModalBeneficiaryCeilings()
  }, [])

  return (
    <AppInformationModal
      title={t`Pourquoi cette limite\u00a0?`}
      numberOfLinesTitle={2}
      visible={visible}
      onCloseIconPress={hideModal}
      testIdSuffix="credit-ceiling-information">
      <ModalChildrenContainer>
        <Typo.Body>
          {t`Pour faire le plein de culture et rencontrer ceux qui la font vivre, tu peux dépenser\u00a0:`}
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
