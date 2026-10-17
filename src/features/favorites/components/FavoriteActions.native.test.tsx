import React from 'react'

import {
  FavoriteActions,
  FavoriteActionsProps,
} from 'features/favorites/components/FavoriteActions'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { Button } from 'ui/designSystem/Button/Button'

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const defaultProps = {
  favorite: favoriteResponseSnap,
  onSharePress: jest.fn(),
  shareAccessibilityLabel: 'Partager cette offre',
  onRemove: jest.fn(),
  isRemoving: false,
}

const user = userEvent.setup()
jest.useFakeTimers()

describe('FavoriteActions', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should trigger favorite sharing when pressing share button', async () => {
    renderFavoriteActions({})

    await user.press(screen.getByLabelText('Partager cette offre'))

    expect(defaultProps.onSharePress).toHaveBeenCalledTimes(1)
  })

  it('should renders the primary action when provided', () => {
    renderFavoriteActions({ primaryAction: <Button wording="Réserver" /> })

    expect(screen.getByText('Réserver')).toBeOnTheScreen()
  })

  it('should trigger favorite removing when pressing favorite button', async () => {
    renderFavoriteActions({})

    await user.press(screen.getByLabelText('Retirer des favoris'))

    expect(defaultProps.onRemove).toHaveBeenCalledWith(favoriteResponseSnap.id)
  })
})

function renderFavoriteActions(props: Partial<FavoriteActionsProps>) {
  return render(reactQueryProviderHOC(<FavoriteActions {...defaultProps} {...props} />))
}
