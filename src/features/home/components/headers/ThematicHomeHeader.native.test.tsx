import React from 'react'
import { Animated } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'
import { CategoryThematicHeader, Color, ThematicHeaderType } from 'features/home/types'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const animatedValue = new Animated.Value(0)
const HeaderInterpolation = animatedValue.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 1],
})

const categoryThematicHeader: CategoryThematicHeader = {
  type: ThematicHeaderType.Category,
  title: 'Cinéma',
  subtitle: 'Sous-titre cinéma',
  color: Color.Lilac,
  imageUrl:
    'https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg',
}

describe('ThematicHomeHeader', () => {
  it('should navigate to home page on press go back button', async () => {
    render(
      reactQueryProviderHOC(
        <ThematicHomeHeader
          thematicHeader={categoryThematicHeader}
          headerTransition={HeaderInterpolation}
          homeId="fakeEntryId"
        />
      )
    )
    const backButton = screen.getByTestId('Revenir en arrière')

    await act(async () => {
      fireEvent.press(backButton)
    })

    expect(navigate).toHaveBeenCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  })
})
