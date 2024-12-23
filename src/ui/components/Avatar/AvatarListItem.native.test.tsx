import React from 'react'

import { analytics } from 'libs/analytics'
import { render, screen, userEvent } from 'tests/utils'
import { AvatarListItem } from 'ui/components/Avatar/AvatarListItem'

const user = userEvent.setup()

jest.useFakeTimers()

describe('<AvatarListItem />', () => {
  it('should display artist avatar name', () => {
    render(<AvatarListItem id={1} name="Oda" width={100} from="venue" />)

    expect(screen.getByText('Oda')).toBeOnTheScreen()
  })

  it('should display image avatar', () => {
    render(<AvatarListItem id={1} name="Oda" image="url" width={100} from="venue" />)

    expect(screen.getByLabelText('Avatar de lʼartiste Oda')).toBeOnTheScreen()
  })

  it('should display default image avatar', () => {
    render(<AvatarListItem id={1} name="Oda" width={100} from="venue" />)

    expect(screen.queryByLabelText('Avatar de lʼartiste')).not.toBeOnTheScreen()
    expect(screen.getByTestId('BicolorProfile')).toBeOnTheScreen()
  })

  it('should trigger ConsultArtist event when pressing on avatar', async () => {
    render(<AvatarListItem id={1} name="Oda" width={100} from="venue" venueId={1} />)

    await user.press(screen.getByText('Oda'))

    expect(analytics.logConsultArtist).toHaveBeenNthCalledWith(1, {
      artistName: 'Oda',
      from: 'venue',
      venueId: 1,
    })
  })
})
