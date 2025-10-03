import React from 'react'

import { render, screen } from 'tests/utils'
import { GroupTags } from 'ui/GroupTags/GroupTags'

const tags = ['Tag1', 'Tag2', 'Tag3']

describe('GroupTags', () => {
  it('should display tags correctly', () => {
    render(<GroupTags tags={tags} />)

    expect(screen.getByText('Tag1')).toBeOnTheScreen()
    expect(screen.getByText('Tag2')).toBeOnTheScreen()
    expect(screen.getByText('Tag3')).toBeOnTheScreen()
  })
})
