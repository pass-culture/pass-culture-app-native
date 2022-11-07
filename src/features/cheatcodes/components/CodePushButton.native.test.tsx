import React from 'react'
import CodePush, { LocalPackage, RemotePackage } from 'react-native-code-push' // @codepush
import TestRenderer from 'react-test-renderer'

import { tick } from 'libs/tick'
import { fireEvent, render } from 'tests/utils'

import { CodePushButton } from './CodePushButton'

describe('CodePushButton', () => {
  it('renders correctly', () => {
    const button = render(<CodePushButton />)
    expect(button).toMatchSnapshot()
  })
  it('gets the metadata on mount', async () => {
    // We fake CodePush update metdata
    CodePush.getUpdateMetadata = jest.fn(() =>
      Promise.resolve({ label: 'V4', description: 'New Release !' } as LocalPackage)
    )
    const testRenderer = TestRenderer.create(<CodePushButton />)
    expect(CodePush.getUpdateMetadata).toHaveBeenCalled()
    await tick()
    // We expect that our state has those metadata
    expect(testRenderer.root.instance.state.info).toEqual('V4 (New Release !)')
    expect.assertions(2)
  })
  it('gets the partial metadata', async () => {
    // We fake CodePush update metdata with partial information
    CodePush.getUpdateMetadata = jest.fn(() => Promise.resolve({ label: 'V5' } as LocalPackage))
    const testRenderer = TestRenderer.create(<CodePushButton />)
    expect(CodePush.getUpdateMetadata).toHaveBeenCalled()
    await tick()
    // We expect that our state has those metadata
    expect(testRenderer.root.instance.state.info).toEqual('V5')
    expect.assertions(2)
  })
  it('gets the partial metadata', async () => {
    // We fake CodePush update metdata with null information
    CodePush.getUpdateMetadata = jest.fn(() => Promise.resolve(null))
    const testRenderer = TestRenderer.create(<CodePushButton />)
    expect(CodePush.getUpdateMetadata).toHaveBeenCalled()
    await tick()
    // We expect that our state has not changed
    expect(testRenderer.root.instance.state.info).toBeUndefined()
    expect.assertions(2)
  })
  it('prints that a new version is available if version mismatches', () => {
    // We fake that a new version is available
    CodePush.sync = jest.fn((_, __, ___, mismatchCb) => {
      if (mismatchCb) {
        mismatchCb({} as RemotePackage)
      }
      return Promise.resolve(CodePush.SyncStatus.AWAITING_USER_ACTION)
    })

    // We press the sync button
    const { getByTestId, getByText } = render(<CodePushButton />)
    fireEvent.press(getByTestId('container'))
    expect(CodePush.sync).toHaveBeenCalled()

    // We expect our component to render that a new version is available
    const text = 'Nouvelle version sur AppCenter'
    expect(getByText(text).props.children).toBe(text)
  })

  test.each`
    status
    ${CodePush.SyncStatus.CHECKING_FOR_UPDATE}
    ${CodePush.SyncStatus.AWAITING_USER_ACTION}
    ${CodePush.SyncStatus.DOWNLOADING_PACKAGE}
    ${CodePush.SyncStatus.INSTALLING_UPDATE}
    ${undefined}
  `('prints $status', ({ status }) => {
    // We fake that a new version is available
    CodePush.sync = jest.fn((_options, syncCb) => {
      if (syncCb) {
        syncCb(status)
      }
      return Promise.resolve(status)
    })

    // We press the sync button
    const button = render(<CodePushButton />)
    fireEvent.press(button.getByTestId('container'))
    expect(CodePush.sync).toHaveBeenCalled()

    // We expect our component to render that the corresponding message status
    expect(button).toMatchSnapshot()
  })
})
