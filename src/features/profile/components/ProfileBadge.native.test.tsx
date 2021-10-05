import React from 'react'

import { ProfileBadge } from 'features/profile/components/ProfileBadge'
import { render } from 'tests/utils'
import { Clock } from 'ui/svg/icons/Clock'

describe('ProfileBadge', () => {
  it('should render component correctly if no icon is provided', () => {
    const myComponent = render(<ProfileBadge message={'Tu as déposé ton dossier. Bravo'} />)
    expect(myComponent).toMatchSnapshot()
  })
  it('should render component correctly if icon is provided', () => {
    const myComponent = render(
      <ProfileBadge message={'Tu as déposé ton dossier. Bravo'} icon={Clock} />
    )
    expect(myComponent).toMatchSnapshot()
  })
})
