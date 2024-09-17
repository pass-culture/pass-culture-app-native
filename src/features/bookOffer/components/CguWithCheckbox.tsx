import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components/native'

import { env } from 'libs/environment'
import { ButtonQuaternaryGrey } from 'ui/components/buttons/ButtonQuaternaryGrey'
import { Checkbox } from 'ui/components/inputs/Checkbox/Checkbox'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { getSpacing, Typo } from 'ui/theme'

type Props = {
  isChecked: boolean
  setIsChecked: Dispatch<SetStateAction<boolean>>
}

export const CguWithCheckbox: React.FC<Props> = ({ isChecked, setIsChecked }) => {
  return (
    <Checkbox
      label="conditions générales d’utilisation"
      isChecked={isChecked}
      onPress={() => setIsChecked(!isChecked)}
      withBody={false}>
      <Content>
        <Caption>J’ai lu et j’accepte les </Caption>
        <ExternalTouchableLink
          as={ButtonQuaternaryGrey}
          wording="conditions générales d’utilisation*"
          externalNav={{ url: env.CGU_LINK }}
          justifyContent="flex-start"
          inline
        />
      </Content>
    </Checkbox>
  )
}

const Caption = styled(Typo.Caption)({
  alignSelf: 'center',
  paddingLeft: getSpacing(3),
  flex: 1,
})

const Content = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignSelf: 'center',
})
