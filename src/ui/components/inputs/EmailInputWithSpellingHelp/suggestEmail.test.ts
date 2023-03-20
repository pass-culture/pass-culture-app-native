import { suggestEmail } from './suggestEmail'

const ADDRESS = 'firstname.lastname'

describe('suggestEmail', () => {
  describe('should not suggest an email', () => {
    it('when the email is empty', () => {
      const suggestedEmail = suggestEmail('')

      expect(suggestedEmail).toBeUndefined()
    })

    it('when the email is syntaxically invalid', () => {
      const suggestedEmail = suggestEmail(`${ADDRESS}@gmal.com@gmal.com`)

      expect(suggestedEmail).toBeUndefined()
    })
  })

  describe('given a syntaxically valid email', () => {
    it('should not suggest an email when the domain is known', () => {
      const suggestedEmail = suggestEmail(`${ADDRESS}@gmail.com`)

      expect(suggestedEmail).toBeUndefined()
    })

    describe('when second level domain exists with several top level domains', () => {
      it.each(['hotmail.fr', 'hotmail.com', 'yahoo.fr', 'yahoo.com'])(
        'should not suggest the other top level domain given "%s"',
        (domain) => {
          const input = `${ADDRESS}@${domain}`

          const suggestedEmail = suggestEmail(input)

          expect(suggestedEmail).toBeUndefined()
        }
      )
    })

    it.each(['co', 'fr', 'net'])(
      'should suggest a correction of the top level domain given a wrong top level (gmail.%s) domain for a known second level domain',
      (tld) => {
        const suggestedEmail = suggestEmail(`${ADDRESS}@gmail.${tld}`)

        expect(suggestedEmail?.full).toEqual(`${ADDRESS}@gmail.com`)
      }
    )

    it.each(['gamil.com', 'gmal.com', 'hmail.com'])(
      'should suggest a correction of the second level domain given a mistyped second level domain (%s)',
      (domain) => {
        const suggestedEmail = suggestEmail(`${ADDRESS}@${domain}`)

        expect(suggestedEmail?.full).toEqual(`${ADDRESS}@gmail.com`)
      }
    )

    it.each(['gmail', 'icloud', 'outlook', 'yahoo', 'orange', 'laposte', 'free', 'sfr'])(
      'should suggest a correction of the top level domain given a wrong top level domain (%s.paris) for a known second level domain"',
      (secondLevelDomain) => {
        const input = `${ADDRESS}@${secondLevelDomain}.paris`

        const suggestedEmail = suggestEmail(input)

        expect(suggestedEmail).toBeDefined()
      }
    )
  })
})
