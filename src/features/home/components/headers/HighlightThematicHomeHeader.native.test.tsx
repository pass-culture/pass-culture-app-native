import React from 'react'

import { HighlightThematicHomeHeader } from 'features/home/components/headers/HighlightThematicHomeHeader'
import { ThematicHeaderType } from 'features/home/types'
import { render, screen } from 'tests/utils'

const introductionTitle = 'un super titre pour une super introduction'
const introductionParagraph =
  'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'

const imageProps = {
  type: ThematicHeaderType.Highlight,
  imageUrl:
    'https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg',
  subtitle: 'Un sous-titre',
  title: 'Bloc temps fort',
  beginningDate: new Date('2022-12-21T23:00:00.000Z'),
  endingDate: new Date('2023-01-14T23:00:00.000Z'),
}

const headerProps = {
  ...imageProps,
  title: introductionTitle,
  introductionParagraph,
}

describe('HighlightThematicHomeHeader', () => {
  it('should display introduction when introduction title and paragraph are provided', () => {
    render(<HighlightThematicHomeHeader {...headerProps} />)

    expect(screen.getByText(introductionTitle)).toBeTruthy()
  })

  it('should not display introduction when only introduction title is provided', () => {
    const props = { ...imageProps, introductionTitle }
    render(<HighlightThematicHomeHeader {...props} />)

    expect(screen.queryByText(introductionTitle)).toBeFalsy()
  })

  it('should not display introduction when only introduction paragraph is provided', () => {
    const props = { ...imageProps, introductionParagraph }
    render(<HighlightThematicHomeHeader {...props} />)

    expect(screen.queryByText(introductionTitle)).toBeFalsy()
  })
})
