import React from 'react'

import { ProfileBadge } from 'features/profile/components/Badges/ProfileBadge'
import { shouldOpenInbox } from 'features/profile/helpers/shouldOpenInbox'
import { render, fireEvent } from 'tests/utils'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'

jest.mock('features/profile/helpers/shouldOpenInbox')

describe('ProfileBadge', () => {
  it('should render component correctly if no icon is provided', () => {
    const myComponent = render(<ProfileBadge message={'Tu as déposé ton dossier. Bravo'} />)
    expect(myComponent).toMatchSnapshot()
  })

  it('should render component correctly if icon is provided', () => {
    const myComponent = render(
      <ProfileBadge message={'Tu as déposé ton dossier. Bravo'} popOverIcon={BicolorClock} />
    )
    expect(myComponent).toMatchSnapshot()
  })

  it('should show neither CTA Icon nor CTA message if no CTA message is provided', () => {
    const myComponent = render(
      <ProfileBadge
        message={'Tu as déposé ton dossier. Bravo'}
        popOverIcon={BicolorClock}
        callToActionIcon={EmailFilled}
      />
    )
    expect(myComponent).toMatchSnapshot()
  })

  it('should show CTA Icon and CTA message if Icon, Message and Link are provided', () => {
    const myComponent = render(
      <ProfileBadge
        message={'Tu as déposé ton dossier. Bravo'}
        popOverIcon={BicolorClock}
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
        popOverIcon={BicolorClock}
        callToActionIcon={EmailFilled}
        callToActionMessage={'Tu peux cliquer ici'}
      />
    )
    expect(myComponent).toMatchSnapshot()
  })

  it('should call shouldOpenInbox with url onPress', () => {
    const { getByText } = render(
      <ProfileBadge
        message={'Tu as déposé ton dossier. Bravo'}
        popOverIcon={BicolorClock}
        callToActionIcon={EmailFilled}
        callToActionLink={'https://google.com'}
        callToActionMessage={'Tu peux cliquer ici'}
      />
    )
    const CTAButton = getByText('Tu peux cliquer ici')
    fireEvent.press(CTAButton)
    expect(shouldOpenInbox).toHaveBeenCalledWith('https://google.com')
  })
})
