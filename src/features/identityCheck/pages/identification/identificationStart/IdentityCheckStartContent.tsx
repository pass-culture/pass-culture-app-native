import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { DMSModal } from 'features/identityCheck/components/DMSModal'
import { analytics } from 'libs/firebase/analytics'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { useModal } from 'ui/components/modals/useModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { Plus } from 'ui/svg/icons/Plus'
import { getSpacing, Typo } from 'ui/theme'
export function IdentityCheckStartContent() {
  const { visible, showModal, hideModal } = useModal(false)
  const showDMSModal = () => {
    analytics.logStartDMSTransmission()
    showModal()
  }

  return (
    <Container>
      <Spacer.Column numberOfSpaces={10} />
      <StyledBicolorIdCardWithMagnifyingGlass />
      <Spacer.Column numberOfSpaces={6} />
      <Title>{t`Vérification de l'identité`}</Title>
      <Spacer.Column numberOfSpaces={6} />
      <Body>
        {t`Prends une photo de ta`}
        <Bold>{'\u00a0' + t`carte d'identité` + '\u00a0'}</Bold>
        {t`ou de ton`}
        <Bold>{'\u00a0' + t`passeport` + '\u00a0'}</Bold>
        {t`en cours de validité pour accéder à ton pass Culture.`}
      </Body>
      <Spacer.Column numberOfSpaces={6} />
      <Spacer.Flex />
      <DMSInformationContainer>
        <Typo.CaptionNeutralInfo>{t`Si tu n’es pas en mesure de prendre en photo ta pièce d’identité, tu peux transmettre un autre document via le site Démarches-Simplifiées`}</Typo.CaptionNeutralInfo>
        <ButtonQuaternaryBlack
          wording={t`Transmettre un document`}
          onPress={showDMSModal}
          icon={Plus}
          justifyContent="flex-start"
        />
      </DMSInformationContainer>
      <DMSModal visible={visible} hideModal={hideModal} />
      <Spacer.Column numberOfSpaces={2} />
    </Container>
  )
}

const StyledBicolorIdCardWithMagnifyingGlass = styled(BicolorIdCardWithMagnifyingGlass).attrs(
  ({ theme }) => ({
    size: theme.illustrations.sizes.fullPage,
  })
)``

const Container = styled.View({ height: '100%', alignItems: 'center' })

const Title = styled(Typo.Title4)({ textAlign: 'center' })

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
  textAlign: 'center',
}))

const Bold = styled(Typo.Body)(({ theme }) => ({ fontFamily: theme.fontFamily.bold }))

const DMSInformationContainer = styled.View(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.colors.greyLight,
  paddingTop: getSpacing(4),
  paddingHorizontal: getSpacing(4),
  paddingBottom: getSpacing(2),
  borderRadius: theme.borderRadius.checkbox,
}))
