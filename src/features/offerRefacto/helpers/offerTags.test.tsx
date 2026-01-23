import React from 'react'
import { View } from 'react-native'

import { getInteractionTagLabel, getTags } from 'features/offerRefacto/helpers'
import { Tag } from 'ui/designSystem/Tag/Tag'

describe('getTags', () => {
  it('should return the offer subcategory by default', () => {
    const tags = getTags('Cinéma plein air')

    expect(tags).toEqual(['Cinéma plein air'])
  })

  it('should return music type in tags list when offer has it', () => {
    const tags = getTags('Cinéma plein air', { musicType: 'Pop' })

    expect(tags).toEqual(['Cinéma plein air', 'Pop'])
  })

  it('should return music type and subtype in tags list when offer has it', () => {
    const tags = getTags('Cinéma plein air', { musicType: 'Pop', musicSubType: 'Dance Pop' })

    expect(tags).toEqual(['Cinéma plein air', 'Pop', 'Dance Pop'])
  })

  it('should return show type in tags list when offer has it', () => {
    const tags = getTags('Cinéma plein air', { showType: 'Théâtre' })

    expect(tags).toEqual(['Cinéma plein air', 'Théâtre'])
  })

  it('should return show type and subtype in tags list when offer has it', () => {
    const tags = getTags('Cinéma plein air', { showType: 'Théâtre', showSubType: 'Comédie' })

    expect(tags).toEqual(['Cinéma plein air', 'Théâtre', 'Comédie'])
  })

  it('should not return data when it is null or undefined', () => {
    const tags = getTags('Cinéma plein air', { showType: null, showSubType: undefined })

    expect(tags).toEqual(['Cinéma plein air'])
  })

  it('should return cinema genres in tags list when offer has it', () => {
    const cinemaGenres = ['Action', 'Comedy', 'Drama']
    const tags = getTags('Cinéma plein air', { genres: cinemaGenres })

    expect(tags).toEqual(['Cinéma plein air', 'Action', 'Comedy', 'Drama'])
  })

  it('should handle empty cinema genres', () => {
    const tags = getTags('Cinéma plein air', { genres: [] })

    expect(tags).toEqual(['Cinéma plein air'])
  })

  it('should handle undefined cinema genres', () => {
    const tags = getTags('Cinéma plein air', { genres: undefined })

    expect(tags).toEqual(['Cinéma plein air'])
  })

  it('should handle null cinema genres', () => {
    const tags = getTags('Cinéma plein air', { genres: null })

    expect(tags).toEqual(['Cinéma plein air'])
  })
})

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
