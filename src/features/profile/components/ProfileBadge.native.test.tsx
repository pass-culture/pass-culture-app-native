import React from 'react'

import { ProfileBadge } from 'features/profile/components/ProfileBadge'
import { handleCallToActionLink } from 'features/profile/utils'
import { render, fireEvent } from 'tests/utils'
import { Clock } from 'ui/svg/icons/Clock'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'

jest.mock('features/profile/utils')

describe('ProfileBadge', () => {
  it('should render component correctly if no icon is provided', () => {
    const myComponent = render(<ProfileBadge message={'Tu as déposé ton dossier. Bravo'} />)
    expect(myComponent).toMatchSnapshot()
  })
  it('should render component correctly if icon is provided', () => {
    const myComponent = render(
      <ProfileBadge message={'Tu as déposé ton dossier. Bravo'} popOverIcon={Clock} />
    )
    expect(myComponent).toMatchSnapshot()
  })
  it('should show neither CTA Icon nor CTA message if no CTA message is provided', () => {
    const myComponent = render(
      <ProfileBadge
        message={'Tu as déposé ton dossier. Bravo'}
        popOverIcon={Clock}
        callToActionIcon={EmailFilled}
      />
    )
    expect(myComponent).toMatchSnapshot()
  })
  it('should show CTA Icon and CTA message if Icon, Message and Link are provided', () => {
    const myComponent = render(
      <ProfileBadge
        message={'Tu as déposé ton dossier. Bravo'}
        popOverIcon={Clock}
        callToActionIcon={EmailFilled}
        callToActionMessage={'Tu peux cliquer ici'}
        callToActionLink={'https://calltoaction.com'}
      />
    )
    expect(myComponent).toMatchSnapshot()
  })
  it('should not show CTA if no link is provided', () => {
    const myComponent = render(
      <ProfileBadge
        message={'Tu as déposé ton dossier. Bravo'}
        popOverIcon={Clock}
        callToActionIcon={EmailFilled}
        callToActionMessage={'Tu peux cliquer ici'}
      />
    )
    expect(myComponent).toMatchSnapshot()
  })
  it('should call handleCallToActionLink with url onPress', () => {
    const { getByTestId } = render(
      <ProfileBadge
        message={'Tu as déposé ton dossier. Bravo'}
        popOverIcon={Clock}
        callToActionIcon={EmailFilled}
        callToActionLink={'https://google.com'}
        callToActionMessage={'Tu peux cliquer ici'}
      />
    )
    const CTAButton = getByTestId('call-to-action-button')
    fireEvent.press(CTAButton)
    expect(handleCallToActionLink).toHaveBeenCalledWith('https://google.com')
  })
})
