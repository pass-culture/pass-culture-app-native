import React from 'react'
import { Text } from 'react-native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'

export const CollapsibleText = ({ children, onExpandPress }) => (
  <React.Fragment>
    <Text>{children}</Text>
    <TouchableOpacity onPress={onExpandPress}>
      <Text>Voir plus</Text>
    </TouchableOpacity>
  </React.Fragment>
)
