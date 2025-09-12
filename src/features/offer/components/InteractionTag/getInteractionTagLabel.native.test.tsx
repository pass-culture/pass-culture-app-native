import React from 'react'
import { View } from 'react-native'

import { Tag } from 'ui/components/Tag/Tag'

import { getInteractionTagLabel } from './getInteractionTagLabel'

describe('getInteractionTagLabel', () => {
  it('retourne le label si c’est un élément React valide', () => {
    const element = <Tag label="Test Label" />

    expect(getInteractionTagLabel(element)).toBe('Test Label')
  })

  it('retourne undefined si ce n’est pas un élément React', () => {
    const notElement = 'Je ne suis pas un élément'

    expect(getInteractionTagLabel(notElement)).toBeUndefined()
  })

  it('retourne undefined si l’élément n’a pas de label', () => {
    const elementWithoutLabel = <View />

    expect(getInteractionTagLabel(elementWithoutLabel)).toBeUndefined()
  })
})
