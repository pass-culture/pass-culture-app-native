import React, { FunctionComponent } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components/native'

import { BrokenConnection } from 'ui/svg/BrokenConnection'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { IconInterface } from 'ui/svg/icons/types'
import { PhoneError } from 'ui/svg/PhoneError'
import { ColorsEnum, getSpacing } from 'ui/theme'

export const Illustrations: FunctionComponent = () => {
  return (
    <React.Fragment>
      <Illustration name="BicolorPhonePending" component={BicolorPhonePending} isNew />
      <Illustration name="BrokenConnection" component={BrokenConnection} isNew />
      <Illustration name="PhoneError" component={PhoneError} isNew />
    </React.Fragment>
  )
}

interface IllustrationsProps {
  name: string
  component: React.ComponentType<IconInterface>
  isNew?: boolean
}

const Illustration = ({ name, component: IconComponent, isNew = false }: IllustrationsProps) => (
  <AlignedText>
    <IconComponent size={getSpacing(20)} />
    <Text style={{ color: isNew ? ColorsEnum.BLACK : ColorsEnum.GREY_DARK }}>
      {` - ${name} ${isNew ? '(new)' : ''}`}
    </Text>
  </AlignedText>
)
const AlignedText = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
})
