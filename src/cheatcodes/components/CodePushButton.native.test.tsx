import React from 'react'
import CodePush, { LocalPackage, RemotePackage } from 'react-native-code-push' // @codepush

import { render, renderAsync, screen, userEvent } from 'tests/utils'

import { CodePushButton } from './CodePushButton'

const user = userEvent.setup()

describe('CodePushButton', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it('gets the metadata on mount', async () => {
    // We fake CodePush update metdata
    CodePush.getUpdateMetadata = jest.fn(() =>
      Promise.resolve({ label: 'V4', description: 'New Release !' } as LocalPackage)
    )
    await renderAsync(<CodePushButton />)

    expect(CodePush.getUpdateMetadata).toHaveBeenCalledTimes(1)

    // We expect that the component displays the metadata info
    expect(screen.getByText('V4 (New Release !)')).toBeTruthy()
    expect.assertions(2)
  })

  it('gets the partial metadata when CodePush update metdata with partial information', async () => {
    CodePush.getUpdateMetadata = jest.fn(() => Promise.resolve({ label: 'V5' } as LocalPackage))
    await renderAsync(<CodePushButton />)

    expect(CodePush.getUpdateMetadata).toHaveBeenCalledTimes(1)

    // We expect that the component displays the partial metadata
    expect(screen.getByText('V5')).toBeTruthy()
    expect.assertions(2)
  })

  it('gets the partial metadata when CodePush update metdata with null information', async () => {
    CodePush.getUpdateMetadata = jest.fn(() => Promise.resolve(null))
    await renderAsync(<CodePushButton />)

    expect(CodePush.getUpdateMetadata).toHaveBeenCalledTimes(1)

    // We expect that no metadata info is displayed (only the button with default text)
    expect(screen.getByTestId('Check update')).toBeTruthy()
    expect(screen.queryByText(/V\d/)).toBeNull() // Should not find any version text
    expect.assertions(3)
  })

  it('prints that a new version is available if version mismatches', async () => {
    jest.useFakeTimers()

    // We fake that a new version is available
    CodePush.sync = jest.fn((_, __, ___, mismatchCb) => {
      if (mismatchCb) {
        mismatchCb({} as RemotePackage)
      }
      return Promise.resolve(CodePush.SyncStatus.AWAITING_USER_ACTION)
    })

    render(<CodePushButton />)
    await user.press(screen.getByTestId('Check update'))

    expect(CodePush.sync).toHaveBeenCalledTimes(1)

    // We expect our component to render that a new version is available
    const text = 'Nouvelle version sur AppCenter'

    expect(screen.getByText(text).props.children).toBe(text)
  })

  it.each`
    status                                      | displayStatusMessage
    ${CodePush.SyncStatus.CHECKING_FOR_UPDATE}  | ${'Checking for update'}
    ${CodePush.SyncStatus.AWAITING_USER_ACTION} | ${'Awaiting action'}
    ${CodePush.SyncStatus.DOWNLOADING_PACKAGE}  | ${'Downloading'}
    ${CodePush.SyncStatus.INSTALLING_UPDATE}    | ${'Installing'}
    ${undefined}                                | ${'No update found'}
  `(
    'prints $status with message status : $displayStatusMessage',
    async ({
      status,
      displayStatusMessage,
    }: {
      status: CodePush.SyncStatus
      displayStatusMessage: string
    }) => {
      jest.useFakeTimers()

      // We fake that a new version is available
      CodePush.sync = jest.fn((_options, syncCb) => {
        if (syncCb) {
          syncCb(status)
        }
        return Promise.resolve(status)
      })

      // We press the sync button
      render(<CodePushButton />)
      await user.press(screen.getByTestId('Check update'))

      expect(CodePush.sync).toHaveBeenCalledTimes(1)

      // We expect our component to render that the corresponding message status
      const messageStatus = screen.getByTestId('status')

      expect(messageStatus.props.children).toEqual(displayStatusMessage)
    }
  )
})
