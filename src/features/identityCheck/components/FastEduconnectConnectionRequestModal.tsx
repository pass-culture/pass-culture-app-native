import { t } from '@lingui/macro'
import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModal } from 'ui/components/modals/AppModal'
import { OrSeparator } from 'ui/components/OrSeparator'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { EditPen } from 'ui/svg/icons/EditPen'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Typo, getSpacing } from 'ui/theme'

interface FastEduconnectConnectionRequestModalProps {
  visible: boolean
  hideModal: () => void
}

export const FastEduconnectConnectionRequestModal: React.FC<FastEduconnectConnectionRequestModalProps> =
  ({ visible, hideModal }) => {
    const { colors } = useTheme()

    return (
      <AppModal
        title={t`Identifie-toi en 2 minutes`}
        visible={visible}
        leftIconAccessibilityLabel={'leftIconButton'}
        leftIcon={ArrowPrevious}
        onLeftIconPress={hideModal}
        rightIconAccessibilityLabel={'rightIconButton'}
        rightIcon={Close}
        onRightIconPress={hideModal}>
        <MainContent color={colors.greyDark}>
          {t`Tu peux vérifier ton identité en moins de 2 minutes en utilisant ton compte ÉduConnect. Si tu n'as pas d'identifiants ÉduConnect rapproche toi de ton établissement. `}
        </MainContent>

        <TextQuestion icon={InfoPlain} title={t`C’est quoi ÉduConnect ?`} />

        <ButtonPrimary
          title={'Identification avec ÉduConnect  '}
          onPress={() => {
            /*
            TODO: navigate to educonnect identification
           */
          }}
        />

        <OrSeparator />

        <ButtonTertiaryBlack icon={EditPen} title={t`Identification manuelle`} />
        <DurationInfoText color={colors.greyDark}>{t`Environ 3 heures`}</DurationInfoText>
      </AppModal>
    )
  }

const MainContent = styled(Typo.Body)({
  textAlign: 'center',
})

const DurationInfoText = styled(Typo.Body)({
  textAlign: 'center',
})

const TextQuestion = styled(ButtonTertiaryBlack)({
  marginBottom: getSpacing(4),
})
