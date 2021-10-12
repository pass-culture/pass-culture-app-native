import React from 'react'

import { ProfileBadge } from 'features/profile/components/ProfileBadge'
import { render } from 'tests/utils'
import { Clock } from 'ui/svg/icons/Clock'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'

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
  it('should show neither CTA Icon nor CTA message if no CTA message is provided', () => {
    const myComponent = render(
      <ProfileBadge
        message={'Tu as déposé ton dossier. Bravo'}
        icon={Clock}
        callToActionIcon={EmailFilled}
      />
    )
    expect(myComponent).toMatchSnapshot()
  })
  it('should show CTA Icon and CTA message if both are provided', () => {
    const myComponent = render(
      <ProfileBadge
        message={'Tu as déposé ton dossier. Bravo'}
        icon={Clock}
        callToActionIcon={EmailFilled}
        callToActionMessage={'Tu peux cliquer ici'}
      />
    )
    expect(myComponent).toMatchSnapshot()
  })
})
