import { getFinalTagIcon } from 'ui/components/Tag/helper/getTagIcon'
import { variantIcons } from 'ui/components/Tag/Tag.variants'
import { TagVariant } from 'ui/components/Tag/types'

describe('getFinalTagIcon', () => {
  const CustomIcon = () => null

  it('should return forced icon for TagVariant.BOOKCLUB', () => {
    const result = getFinalTagIcon(TagVariant.BOOKCLUB, CustomIcon)

    expect(result).toEqual(variantIcons[TagVariant.BOOKCLUB])
  })

  it('should return passed icon for TagVariant.SUCCESS', () => {
    const result = getFinalTagIcon(TagVariant.SUCCESS, CustomIcon)

    expect(result).toEqual(CustomIcon)
  })

  it('should return undefined if no icon provided and not forced', () => {
    const result = getFinalTagIcon(TagVariant.SUCCESS)

    expect(result).toBeUndefined()
  })
})
