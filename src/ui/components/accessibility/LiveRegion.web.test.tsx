// eslint-disable-next-line no-restricted-imports
import { render, screen } from '@testing-library/react'
import React from 'react'

import { LiveRegion } from 'ui/components/accessibility/LiveRegion'

describe('<LiveRegion />', () => {
  it('should render the live regions even without any announcement', () => {
    render(<LiveRegion />)

    expect(screen.getAllByRole('status')).toHaveLength(2)
  })

  it('should use the alert role when politeness is assertive', () => {
    render(<LiveRegion politeness="assertive" />)

    expect(screen.getAllByRole('alert')).toHaveLength(2)
    expect(screen.queryAllByRole('status')).toHaveLength(0)
  })

  it('should display the announced message', () => {
    render(<LiveRegion announcement={{ id: 'first', message: 'Message announced' }} />)

    expect(screen.getByText('Message announced')).toBeInTheDocument()
  })

  it('should move the message to the other buffer when a new announcement is received', () => {
    const { rerender } = render(
      <LiveRegion announcement={{ id: 'first', message: 'First message' }} />
    )

    expect(screen.getAllByRole('status')[0]).toHaveTextContent('First message')

    rerender(<LiveRegion announcement={{ id: 'second', message: 'Second message' }} />)

    const buffers = screen.getAllByRole('status')

    expect(buffers[0]).toHaveTextContent('')
    expect(buffers[1]).toHaveTextContent('Second message')
  })

  it('should re-announce two consecutive identical messages', () => {
    const { rerender } = render(
      <LiveRegion announcement={{ id: 'first', message: 'Same message' }} />
    )

    rerender(<LiveRegion announcement={{ id: 'second', message: 'Same message' }} />)

    const buffers = screen.getAllByRole('status')

    expect(buffers[0]).toHaveTextContent('')
    expect(buffers[1]).toHaveTextContent('Same message')
  })

  it('should keep the message when the announcement is removed', () => {
    const { rerender } = render(
      <LiveRegion announcement={{ id: 'first', message: 'First message' }} />
    )

    rerender(<LiveRegion />)

    expect(screen.getByText('First message')).toBeInTheDocument()
  })

  it('should not re-announce an announcement with the same id', () => {
    const { rerender } = render(
      <LiveRegion announcement={{ id: 'first', message: 'First message' }} />
    )

    rerender(<LiveRegion announcement={{ id: 'first', message: 'First message' }} />)

    const buffers = screen.getAllByRole('status')

    expect(buffers[0]).toHaveTextContent('First message')
    expect(buffers[1]).toHaveTextContent('')
  })
})
