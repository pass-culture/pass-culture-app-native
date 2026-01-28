import { StoryFn } from '@storybook/react-vite'
import React, { useMemo } from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

import { Emoji } from './Emoji'

export default {
  title: 'Fondations',
}

export const Emojis: StoryFn<React.FC> = () => {
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
            <Typo.Body> - {name}</Typo.Body>
          </AlignedText>
        )
      })}
    </React.Fragment>
  )
}

const AlignedText = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: theme.designSystem.size.spacing.xs,
}))
