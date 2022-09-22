import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { Close } from 'ui/svg/icons/Close'
import { Flash } from 'ui/svg/icons/Flash'
import { Sun } from 'ui/svg/icons/Sun'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'
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
    title="Quelques conseils"
    rightIconAccessibilityLabel="Fermer la modale de conseils pour avoir un document lisible"
    rightIcon={Close}
    onRightIconPress={hideModal}>
    <Description>
      <Typo.Body>
        Il est important que les informations de ton document soient parfaitement lisibles.
      </Typo.Body>
      {LINE_BREAK}
      <Typo.Body>Nos conseils&nbsp;:</Typo.Body>
    </Description>
    <Instructions>
      <Instruction title="Désactive ton flash" Icon={Flash} />
      <Instruction title="Place-toi dans un lieu bien éclairé" Icon={Sun} />
      <Instruction title="Cadre l’intégralité de ton document" Icon={BicolorIdCard} />
    </Instructions>
    <ButtonPrimary wording="J’ai compris" onPress={onPressContinue} />
  </AppModal>
)

const Description = styled(Typo.Body)({ textAlign: 'center' })

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
      <StyledBody>{title}</StyledBody>
    </InstructionContainer>
  )
}

const InstructionContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: getSpacing(3),
})

const StyledBody = styled(Typo.Body)({ paddingLeft: getSpacing(2) })
const Instructions = styled.View({ width: '100%', paddingVertical: getSpacing(6) })
