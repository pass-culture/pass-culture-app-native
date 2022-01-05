import React from 'react'

import { ExternalLink } from 'ui/components/buttons/externalLink/ExternalLink'

import { customFindUrlChunks, highlightLinks } from '../highlightLinks'

const description1WithoutUrl = `PRESSE / ILS EN PARLENT !
« Drôle, intelligente, intéressante, intéressée, chaleureuse et humble » Libération
« Irrésistible ! » Elle
« Intelligent et revigorant » Le Parisien
« Hilarant » Vanity Fair 
Voir plus de critiques en suivant le lien suivant : `

const description1 = description1WithoutUrl + 'https://fauxliencritique.com/'

const description2 = `https://www.google.com/ Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
https://www.google.com/ Lorem ipsum dolor sit amet, consectetur https://another-wronglyplacedurl.extension_is_6_car_max elit. 
https://www.google.com/ Lorem ipsum dolor sit amet, consecteturhttps://wrongly-placed.urladipiscing elit. 
some text here as well https://www.google.com/?key=valeu&key2=value2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. 

https://www.google.com/`

describe('customFindUrlChunks', () => {
  it('finds url chunk and mark it as highlited', () => {
    const highlightedChunks1 = customFindUrlChunks({
      textToHighlight: description1,
      searchWords: [],
    })
    expect(highlightedChunks1.length).toBe(1)
    expect(description1.slice(0, highlightedChunks1[0].start)).toBe(description1WithoutUrl)
  })

  it('finds url chunks and mark them as highlited', () => {
    const highlightedChunks2 = customFindUrlChunks({
      textToHighlight: description2,
      searchWords: [],
    })
    expect(highlightedChunks2.length).toBe(5)
  })
})

describe('highlightLinks', () => {
  it('transforms a description into an array of strings or <ExternalLink/>', () => {
    const parsedDescription = highlightLinks(description1)
    expect(parsedDescription.length).toBe(2)
    expect(parsedDescription[0]).toEqual(description1WithoutUrl)
    expect(typeof parsedDescription[1]).toBe('object')
    expect(JSON.stringify(parsedDescription[1])).toBe(
      JSON.stringify(<ExternalLink key="external-link-1" url="https://fauxliencritique.com/" />)
    )
  })
})
