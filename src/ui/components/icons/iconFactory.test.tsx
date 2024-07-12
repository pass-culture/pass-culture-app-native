import { ArrowRightNew } from 'ui/svg/icons/ArrowRightNew'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'

import { iconFactory, IconNames } from './iconFactory'

describe('iconFactory', () => {
  it('should return icon component from its name', () => {
    expect(iconFactory.getIcon('next')).toBe(ArrowRightNew)
    expect(iconFactory.getIcon('like-filled')).toBe(ThumbUpFilled)
    expect(iconFactory.getIcon('' as IconNames)).toBeUndefined()
  })
})
