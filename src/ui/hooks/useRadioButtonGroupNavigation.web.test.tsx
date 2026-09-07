import React, { useRef, useState } from 'react'
import { View } from 'react-native'

import { act, render, screen, userEvent, waitFor } from 'tests/utils/web'
import { useRadioButtonGroupNavigation } from 'ui/hooks/useRadioButtonGroupNavigation'

const options = [
  { key: 'first', label: 'First' },
  { key: 'second', label: 'Second' },
  { key: 'third', label: 'Third' },
]
const longOptions = Array.from({ length: 8 }, (_, index) => ({
  key: String(index),
  label: `Option ${index}`,
}))
const scrollToIndex = jest.fn()
const scrollToOffset = jest.fn()
const onChange = jest.fn()

// Mount a subset of options to exercise the handoff between scrolling and the
// asynchronous rendering of a virtualized window without JSDOM layout metrics.
const VirtualizedGroup = ({
  visibleKeys = [],
  value = 'First',
  failScroll = false,
  advanceOnScroll = false,
  options: groupOptions = options,
}: {
  visibleKeys?: string[]
  value?: string
  failScroll?: boolean
  advanceOnScroll?: boolean
  options?: typeof options
}) => {
  const [highestMeasuredFrameIndex, setHighestMeasuredFrameIndex] = useState(0)
  const containerRef = useRef<View>(null)
  const listRef = useRef({ scrollToIndex, scrollToOffset })
  const { getRadioProps, onScrollToIndexFailed } = useRadioButtonGroupNavigation({
    containerRef,
    listRef,
    options: groupOptions,
    value,
    disabled: false,
    onChange,
    id: 'virtualized',
  })

  if (failScroll || advanceOnScroll) {
    scrollToIndex.mockImplementation(({ index }: { index: number }) => {
      onScrollToIndexFailed?.({ index, averageItemLength: 100, highestMeasuredFrameIndex })
    })
  }

  if (advanceOnScroll) {
    // Each scroll reveals another window, as the real list extends its measured range.
    scrollToOffset.mockImplementation(() => setHighestMeasuredFrameIndex((index) => index + 1))
  }

  return (
    <React.Fragment>
      <View ref={containerRef} role="radiogroup" accessibilityLabel="Virtualized choices">
        {groupOptions
          .filter((option, index) =>
            advanceOnScroll ? index <= highestMeasuredFrameIndex : visibleKeys.includes(option.key)
          )
          .map((option) => (
            <View
              key={option.key}
              {...getRadioProps(option.key)}
              role="radio"
              aria-checked={option.label === value}
              accessibilityLabel={option.label}
            />
          ))}
      </View>
      <button aria-label="After" />
    </React.Fragment>
  )
}

describe('virtualized radio navigation', () => {
  beforeEach(() => {
    scrollToIndex.mockReset()
    scrollToOffset.mockReset()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it.each([
    { value: 'Option 0', action: 'arrow navigation', changes: 1 },
    { value: 'Option 7', action: 'entry on an offscreen selection', changes: 0 },
  ])('continues across advancing windows for $action', async ({ value, changes }) => {
    jest.useFakeTimers()
    const user = await userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<VirtualizedGroup options={longOptions} value={value} advanceOnScroll />)
    await user.tab()
    if (changes) await user.keyboard('[ArrowUp]')

    for (let renderWindow = 0; renderWindow < longOptions.length; renderWindow += 1) {
      await act(async () => jest.advanceTimersByTime(100))
    }

    expect(screen.getByRole('radio', { name: 'Option 7' })).toHaveFocus()
    expect(scrollToOffset.mock.calls.length).toBeGreaterThan(3)
    expect(onChange.mock.calls).toEqual(changes ? [['Option 7']] : [])

    await user.tab()

    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
  })

  it.each(['blur', 'unmount'])('cancels advancing retries on %s', async (action) => {
    jest.useFakeTimers()
    const user = await userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    const { unmount } = render(
      <VirtualizedGroup options={longOptions} value="Option 0" advanceOnScroll />
    )
    await user.tab()
    await user.keyboard('[ArrowUp]')
    await act(async () => jest.advanceTimersByTime(100))

    if (action === 'blur') await user.tab()
    else unmount()
    const attempts = scrollToIndex.mock.calls.length
    await act(async () => jest.advanceTimersByTime(1000))

    expect(scrollToIndex).toHaveBeenCalledTimes(attempts)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('scrolls to an unmounted option and focuses and selects it once it is rendered', async () => {
    const user = await userEvent.setup()
    const { rerender } = render(<VirtualizedGroup visibleKeys={['first']} />)
    await user.tab()
    await user.keyboard('[ArrowLeft]')

    expect(scrollToIndex).toHaveBeenCalledWith({ index: 2, animated: false })
    expect(onChange).not.toHaveBeenCalled()

    rerender(<VirtualizedGroup visibleKeys={['third']} />)
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Third' })).toHaveFocus())

    expect(onChange).toHaveBeenCalledWith('Third')
  })

  it('forwards group entry to a selected option outside the rendered window', async () => {
    const user = await userEvent.setup()
    const { rerender } = render(<VirtualizedGroup visibleKeys={['first']} value="Third" />)
    await user.tab()

    expect(scrollToIndex).toHaveBeenCalledWith({ index: 2, animated: false })

    rerender(<VirtualizedGroup visibleKeys={['third']} value="Third" />)
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Third' })).toHaveFocus())

    expect(onChange).not.toHaveBeenCalled()

    await user.tab()

    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
  })

  it('does not steal focus if the user leaves before the target is rendered', async () => {
    const user = await userEvent.setup()
    const { rerender } = render(<VirtualizedGroup visibleKeys={['first']} />)
    await user.tab()
    await user.keyboard('[ArrowRight]')
    await user.tab()
    rerender(<VirtualizedGroup visibleKeys={['first', 'second']} />)

    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('bounds retries when the measured range stops advancing', async () => {
    jest.useFakeTimers()
    const user = await userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<VirtualizedGroup visibleKeys={['first']} failScroll />)
    await user.tab()
    await user.keyboard('[ArrowRight]')

    act(() => jest.advanceTimersByTime(1000))

    expect(scrollToIndex).toHaveBeenCalledTimes(4)
    expect(scrollToOffset).toHaveBeenCalledTimes(3)
  })
})
