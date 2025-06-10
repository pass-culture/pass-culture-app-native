import React from 'react'

import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'

type DisplayMode = 'list' | 'grid'

type props = {
  display: DisplayMode
  onPress: VoidFunction
}

export const GridListDisplayToggle = ({ display = 'list', onPress }: props) => {
  return <ButtonQuaternaryBlack wording={display} onPress={onPress} />
}
