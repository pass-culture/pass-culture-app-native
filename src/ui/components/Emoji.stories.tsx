import { ComponentStory } from '@storybook/react'
import React, { useMemo } from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

import { Emoji } from './Emoji'

export default {
  title: 'Fondations',
}

export const Emojis: ComponentStory<React.FC> = () => {
  const sortedEmojis = useMemo(() => {
    return Object.entries(Emoji).sort(([name1], [name2]) => {
      if (name1 < name2) return -1
      else if (name1 > name2) return 1
      else return 0
    })
  }, [])
  return (
    <React.Fragment>
      {sortedEmojis.map(([name, emoji]) => {
        const Emoji = emoji
        return (
          <AlignedText key={name}>
            <Emoji />
            <Text> - {name}</Text>
          </AlignedText>
        )
      })}
    </React.Fragment>
  )
}

const AlignedText = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: getSpacing(1),
})
