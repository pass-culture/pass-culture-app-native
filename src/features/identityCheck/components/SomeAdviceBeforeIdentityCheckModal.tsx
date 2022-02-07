import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'
import { Flash } from 'ui/svg/icons/Flash'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Sun } from 'ui/svg/icons/Sun'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'
interface Props {
  visible: boolean
  hideModal: () => void
  onPressContinue: () => void
}

export const SomeAdviceBeforeIdentityCheckModal: FunctionComponent<Props> = ({
  visible,
  hideModal,
  onPressContinue,
}) => (
  <AppModal
    visible={visible}
    title={t`Quelques conseils`}
    leftIconAccessibilityLabel={undefined}
    leftIcon={undefined}
    onLeftIconPress={undefined}
    rightIconAccessibilityLabel={t`Fermer la modale de conseils pour avoir un document lisible`}
    rightIcon={Close}
    onRightIconPress={hideModal}>
    <Description>
      <Typo.Body>
        {t`Il est important que les informations de ton document soient parfaitement lisibles.`}
        {'\n'}
        {t`Nos conseils\u00a0:`}
      </Typo.Body>
    </Description>
    <Instructions>
      <Instruction title={t`Désactive ton flash`} Icon={Flash} />
      <Instruction title={t`Place-toi dans un lieu bien éclairé`} Icon={Sun} />
      <Instruction title={t`Cadre l’intégralité de ton document`} Icon={IdCard} />
    </Instructions>
    <ButtonPrimary wording={t`J'ai compris`} onPress={onPressContinue} />
  </AppModal>
)

const Description = styled.Text({ textAlign: 'center' })

interface InstructionProps {
  title: string
  Icon: React.FunctionComponent<IconInterface>
}

const Instruction = ({ title, Icon }: InstructionProps) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    color: theme.colors.secondary,
    color2: theme.colors.primary,
    size: theme.icons.sizes.small,
  }))``

  return (
    <InstructionContainer>
      <StyledIcon />
      <Text>{title}</Text>
    </InstructionContainer>
  )
}

const InstructionContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: getSpacing(3),
})

const Text = styled(Typo.Body)({ paddingLeft: getSpacing(2) })
const Instructions = styled.View({ width: '100%', paddingVertical: getSpacing(6) })
