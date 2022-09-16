import React from 'react'

import { ExternalLink } from 'ui/components/buttons/externalLink/ExternalLink'

import { customFindUrlChunks, highlightLinks } from '../highlightLinks'

const description1WithoutUrl = `PRESSE / ILS EN PARLENT\u00a0!
«\u00a0Drôle, intelligente, intéressante, intéressée, chaleureuse et humble\u00a0» Libération
«\u00a0Irrésistible\u00a0!\u00a0» Elle
«\u00a0Intelligent et revigorant\u00a0» Le Parisien
«\u00a0Hilarant\u00a0» Vanity Fair 
Voir plus de critiques en suivant le lien suivant\u00a0:`

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
  describe('transforms a description into an array of strings or <ExternalLink/>', () => {
    describe('composition', () => {
      describe('protocol', () => {
        it('without protocol', () => {
          const parsedDescription = highlightLinks('perdu.com')

          expect(parsedDescription).toEqual([
            <ExternalLink key="external-link-0" url="http://perdu.com" />,
          ])
        })

        it('with http protocol', () => {
          const parsedDescription = highlightLinks('http://penofchaos.com/')

          expect(parsedDescription).toEqual([
            <ExternalLink key="external-link-0" url="http://penofchaos.com/" />,
          ])
        })

        it('with https protocol', () => {
          const parsedDescription = highlightLinks('https://kaamelott.com')

          expect(parsedDescription).toEqual([
            <ExternalLink key="external-link-0" url="https://kaamelott.com" />,
          ])
        })
      })

      it('with subdomain', () => {
        const parsedDescription = highlightLinks('www.penofchaos.com')

        expect(parsedDescription).toEqual([
          <ExternalLink key="external-link-0" url="http://www.penofchaos.com" />,
        ])
      })

      it('with path', () => {
        const parsedDescription = highlightLinks('httpstat.us/418')

        expect(parsedDescription).toEqual([
          <ExternalLink key="external-link-0" url="http://httpstat.us/418" />,
        ])
      })

      it('with query params', () => {
        const parsedDescription = highlightLinks('httpstat.us/200?sleep=500')

        expect(parsedDescription).toEqual([
          <ExternalLink key="external-link-0" url="http://httpstat.us/200?sleep=500" />,
        ])
      })

      it('with hash', () => {
        const parsedDescription = highlightLinks('httpstat.us#anchor')

        expect(parsedDescription).toEqual([
          <ExternalLink key="external-link-0" url="http://httpstat.us#anchor" />,
        ])
      })
    })

    describe('position', () => {
      describe('without protocol', () => {
        it('must be preceded by space', () => {
          const parsedDescription = highlightLinks(
            `${description1WithoutUrl} www.penofchaos.com/warham/donjon.htm`
          )

          expect(parsedDescription).toEqual([
            `${description1WithoutUrl} `,
            <ExternalLink
              key="external-link-1"
              url="http://www.penofchaos.com/warham/donjon.htm"
            />,
          ])
        })

        it('is not recognized without a previous space', () => {
          const description = `${description1WithoutUrl}www.penofchaos.com/warham/donjon.htm`

          const parsedDescription = highlightLinks(description)

          expect(parsedDescription).toEqual([description])
        })

        it('can have one URL per line', () => {
          const description = 'www.penofchaos.com/warham/donjon.htm\nperdu.com'

          const parsedDescription = highlightLinks(description)

          expect(parsedDescription).toEqual([
            <ExternalLink
              key="external-link-0"
              url="http://www.penofchaos.com/warham/donjon.htm"
            />,
            '\n',
            <ExternalLink key="external-link-2" url="http://perdu.com" />,
          ])
        })
      })

      describe('with protocol', () => {
        it('can begin without space', () => {
          const parsedDescription = highlightLinks(
            `${description1WithoutUrl}http://www.penofchaos.com/warham/donjon.htm`
          )

          expect(parsedDescription).toEqual([
            description1WithoutUrl,
            <ExternalLink
              key="external-link-1"
              url="http://www.penofchaos.com/warham/donjon.htm"
            />,
          ])
        })
      })

      it('must be followed by space', () => {
        const parsedDescription = highlightLinks(
          `www.penofchaos.com/warham/donjon.htm ${description1WithoutUrl}`
        )

        expect(parsedDescription).toEqual([
          <ExternalLink key="external-link-0" url="http://www.penofchaos.com/warham/donjon.htm" />,
          ` ${description1WithoutUrl}`,
        ])
      })
    })

    it('can contain an email', () => {
      const parsedDescription = highlightLinks('test@passculture.app')

      expect(parsedDescription).toEqual(['test@passculture.app'])
    })
  })
})
