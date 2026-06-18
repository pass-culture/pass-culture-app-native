import React from 'react'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Link } from 'ui/designSystem/Link/Link'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'

import { customFindUrlChunks, highlightLinks } from './highlightLinks'

const getExternalLink = (url: string, key: string) => (
  <ExternalTouchableLink
    key={key}
    as={Link}
    externalNav={{ url }}
    wording={url}
    isExternal
    isInsideText
    icon={ExternalSiteFilled}
    accessibilityRole={AccessibilityRole.LINK}
  />
)

const description1WithoutUrl = `PRESSE / ILS EN PARLENT !
« Drôle, intelligente, intéressante, intéressée, chaleureuse et humble » Libération
« Irrésistible ! » Elle
« Intelligent et revigorant » Le Parisien
« Hilarant » Vanity Fair 
Voir plus de critiques en suivant le lien suivant :`

const description1 = description1WithoutUrl + 'https://fauxliencritique.com/'

const description2 = `https://www.google.com/ Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
https://www.google.com/ Lorem ipsum dolor sit amet, consectetur https://another-wronglyplacedurl.extension_is_6_car_max elit. 
https://www.google.com/ Lorem ipsum dolor sit amet, consecteturhttps://wrongly-placed.urladipiscing elit. 
some text here as well https://www.google.com/?key=valeu&key2=value2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. 

https://www.google.com/`

jest.mock('libs/firebase/analytics/analytics')

describe('customFindUrlChunks', () => {
  it('finds url chunk and mark it as highlited', () => {
    const highlightedChunks1 = customFindUrlChunks({
      textToHighlight: description1,
      searchWords: [],
    })

    expect(highlightedChunks1).toHaveLength(1)
    expect(description1.slice(0, highlightedChunks1[0]?.start)).toBe(description1WithoutUrl)
  })

  it('finds url chunks and mark them as highlited', () => {
    const highlightedChunks2 = customFindUrlChunks({
      textToHighlight: description2,
      searchWords: [],
    })

    expect(highlightedChunks2).toHaveLength(5)
  })

  it('does not recognize unknown TLD as a URL', () => {
    const text = 'Voici un exemple site.ra qui ne doit pas être un lien'

    const highlightedChunks1 = customFindUrlChunks({
      textToHighlight: text,
      searchWords: [],
    })

    expect(highlightedChunks1).toHaveLength(0)
  })

  it('does recognize known TLD as a URL', () => {
    const text = 'Voici un exemple site.fr qui doit être un lien'

    const highlightedChunks1 = customFindUrlChunks({
      textToHighlight: text,
      searchWords: [],
    })

    expect(highlightedChunks1).toHaveLength(1)
  })
})

jest.mock('libs/firebase/analytics/analytics')

describe('highlightLinks', () => {
  describe('transforms a description into an array of strings or external links', () => {
    describe('composition', () => {
      describe('protocol', () => {
        it('without protocol', () => {
          const parsedDescription = highlightLinks('perdu.com')

          expect(parsedDescription).toEqual([
            getExternalLink('http://perdu.com', 'external-link-0'),
          ])
        })

        it('with http protocol', () => {
          const parsedDescription = highlightLinks('http://penofchaos.com/')

          expect(parsedDescription).toEqual([
            getExternalLink('http://penofchaos.com/', 'external-link-0'),
          ])
        })

        it('with https protocol', () => {
          const parsedDescription = highlightLinks('https://kaamelott.com')

          expect(parsedDescription).toEqual([
            getExternalLink('https://kaamelott.com', 'external-link-0'),
          ])
        })
      })

      it('with subdomain', () => {
        const parsedDescription = highlightLinks('www.penofchaos.com')

        expect(parsedDescription).toEqual([
          getExternalLink('http://www.penofchaos.com', 'external-link-0'),
        ])
      })

      it('with path', () => {
        const parsedDescription = highlightLinks('httpstat.us/418')

        expect(parsedDescription).toEqual([
          getExternalLink('http://httpstat.us/418', 'external-link-0'),
        ])
      })

      it('with query params', () => {
        const parsedDescription = highlightLinks('httpstat.us/200?sleep=500')

        expect(parsedDescription).toEqual([
          getExternalLink('http://httpstat.us/200?sleep=500', 'external-link-0'),
        ])
      })

      it('with hash', () => {
        const parsedDescription = highlightLinks('httpstat.us#anchor')

        expect(parsedDescription).toEqual([
          getExternalLink('http://httpstat.us#anchor', 'external-link-0'),
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
            getExternalLink('http://www.penofchaos.com/warham/donjon.htm', 'external-link-1'),
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
            getExternalLink('http://www.penofchaos.com/warham/donjon.htm', 'external-link-0'),
            '\n',
            getExternalLink('http://perdu.com', 'external-link-2'),
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
            getExternalLink('http://www.penofchaos.com/warham/donjon.htm', 'external-link-1'),
          ])
        })
      })

      it('must be followed by space', () => {
        const parsedDescription = highlightLinks(
          `www.penofchaos.com/warham/donjon.htm ${description1WithoutUrl}`
        )

        expect(parsedDescription).toEqual([
          getExternalLink('http://www.penofchaos.com/warham/donjon.htm', 'external-link-0'),
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
