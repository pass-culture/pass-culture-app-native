import { isWikipediaUrl } from 'features/artist/helpers/isWikipediaUrl'

describe('isWikipediaUrl', () => {
  describe('valid Wikipedia URLs', () => {
    it('should return true for a standard HTTPS French Wikipedia URL', () => {
      expect(isWikipediaUrl('https://fr.wikipedia.org/wiki/Victor_Hugo')).toBe(true)
    })

    it('should return true for Wikipedia URLs in different languages', () => {
      expect(isWikipediaUrl('https://en.wikipedia.org/wiki/JavaScript')).toBe(true)
    })

    it('should return true for the main domain without a language subdomain', () => {
      expect(isWikipediaUrl('https://wikipedia.org')).toBe(true)
      expect(isWikipediaUrl('https://www.wikipedia.org')).toBe(true)
    })

    it('should return true for HTTP protocol if allowed', () => {
      expect(isWikipediaUrl('http://fr.wikipedia.org/wiki/Test')).toBe(true)
    })
  })

  describe('security and phishing prevention', () => {
    it('should return false when wikipedia.org is used as a subdomain of another host', () => {
      expect(isWikipediaUrl('https://wikipedia.org.attacker.com/wiki/Malware')).toBe(false)
      expect(isWikipediaUrl('https://fr.wikipedia.org.phishing.io')).toBe(false)
    })

    it('should return false when wikipedia.org is in the path instead of hostname', () => {
      expect(isWikipediaUrl('https://attacker.com/fr.wikipedia.org')).toBe(false)
      expect(isWikipediaUrl('https://google.com/?search=wikipedia.org')).toBe(false)
    })

    it('should return false for typosquatted or non-.org domains', () => {
      expect(isWikipediaUrl('https://fake-wikipedia.org')).toBe(false)
      expect(isWikipediaUrl('https://wikipedia.com')).toBe(false)
    })

    it('should return false for malicious URI schemes (javascript, data, file)', () => {
      expect(isWikipediaUrl('javascript:alert("XSS")')).toBe(false)
      expect(isWikipediaUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
      expect(isWikipediaUrl('file:///etc/passwd')).toBe(false)
    })
  })

  describe('edge cases and invalid inputs', () => {
    it('should return false for an empty string', () => {
      expect(isWikipediaUrl('')).toBe(false)
    })

    it('should return false for undefined or null', () => {
      expect(isWikipediaUrl(undefined)).toBe(false)
      expect(isWikipediaUrl(null)).toBe(false)
    })

    it('should return false for malformed or arbitrary string inputs', () => {
      expect(isWikipediaUrl('not_a_url')).toBe(false)
      expect(isWikipediaUrl('https://')).toBe(false)
      expect(isWikipediaUrl('://invalid-url')).toBe(false)
    })
  })
})
