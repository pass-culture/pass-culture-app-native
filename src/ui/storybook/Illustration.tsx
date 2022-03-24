import React from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

interface IllustrationsProps {
  name: string
  component: React.ComponentType<IconInterface>
}

export const Illustration = ({ name, component: IconComponent }: IllustrationsProps) => {
  const iconName = ` - ${name}`
  return (
    <AlignedText>
      <IconComponent />
      <Typo.Body>{iconName}</Typo.Body>
    </AlignedText>
  )
}

const AlignedText = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: getSpacing(1),
})
