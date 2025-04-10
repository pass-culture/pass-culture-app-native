import { isSectionWithBody } from 'features/venue/helpers/isSectionWithBody/isSectionWithBody'
import { PracticalInformationSection } from 'features/venue/types'

describe('isSectionWithBody', () => {
  it('should return true when shouldBeDisplayed is true and body defined', () => {
    const section: PracticalInformationSection = {
      title: 'Test',
      body: 'Body',
      shouldBeDisplayed: true,
    }

    expect(isSectionWithBody(section)).toEqual(true)
  })

  it('should return false when shouldBeDisplayed is false and body defined', () => {
    const section: PracticalInformationSection = {
      title: 'Test',
      body: 'Body',
      shouldBeDisplayed: false,
    }

    expect(isSectionWithBody(section)).toEqual(false)
  })

  it('should return false when body is null and shouldBeDisplayed is true', () => {
    const section: PracticalInformationSection = {
      title: 'Test',
      body: null,
      shouldBeDisplayed: true,
    }

    expect(isSectionWithBody(section)).toEqual(false)
  })

  it('should return false when shouldBeDisplayed is false and body is null', () => {
    const section: PracticalInformationSection = {
      title: 'Test',
      body: null,
      shouldBeDisplayed: false,
    }

    expect(isSectionWithBody(section)).toEqual(false)
  })
})
