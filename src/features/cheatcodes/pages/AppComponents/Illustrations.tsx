import React, { FunctionComponent } from 'react'
import { Text } from 'react-native'

import { IconsContainer } from 'features/cheatcodes/pages/AppComponents/IconsContainer'
import {
  BicolorIllustrations,
  UniqueColorIllustrations,
} from 'features/cheatcodes/pages/AppComponents/illustrationsExports'
import { Spacer } from 'ui/theme'

export const Illustrations: FunctionComponent = () => {
  return (
    <React.Fragment>
      <Text>Illustration icons should have a standard size of 140</Text>
      <Bicolors />
      <Spacer.Column numberOfSpaces={4} />
      <UniqueColor />
    </React.Fragment>
  )
}

const Bicolors = () => {
  return <IconsContainer title="Bicolors" icons={BicolorIllustrations} />
}

const UniqueColor = () => {
  return <IconsContainer title="UniqueColor" icons={UniqueColorIllustrations} />
}
