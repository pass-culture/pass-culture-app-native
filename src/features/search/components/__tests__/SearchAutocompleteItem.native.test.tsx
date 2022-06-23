import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnum } from 'api/gen'
import { SearchAutocompleteItem } from 'features/search/components/SearchAutocompleteItem'
import { render, fireEvent } from 'tests/utils'

describe('SearchAutocompleteItem component', () => {
  const hit = {
    objectID: '1',
    offer: { name: 'Test1', searchGroupName: SearchGroupNameEnum.CINEMA },
    _geoloc: {},
  }

  it('should render SearchAutocompleteItem', () => {
    expect(render(<SearchAutocompleteItem index={0} hit={hit} />)).toMatchSnapshot()
  })

  it('should display the search group name if the hit is in the top three', () => {
    const { queryByText } = render(<SearchAutocompleteItem index={0} hit={hit} />)

    const text = 'Test1 dans Cinéma'

    expect(queryByText(text)).toBeTruthy()
  })

  it('should not display the search group name if the hit is not in the top three', () => {
    const { queryByText } = render(<SearchAutocompleteItem index={3} hit={hit} />)

    const text = 'Test1'

    expect(queryByText(text)).toBeTruthy()
  })

  it('should navigate on selected offer on hit click', async () => {
    const { getByText } = render(<SearchAutocompleteItem index={0} hit={hit} />)
    await fireEvent.press(getByText('Test1 dans Cinéma'))
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('Offer', { id: +hit.objectID, from: 'search' })
  })
})
