import React from 'react'
import CodePush, { LocalPackage, RemotePackage } from 'react-native-code-push' // @codepush

import { render, screen, userEvent, waitFor } from 'tests/utils'

import { CodePushButton } from './CodePushButton'

const user = userEvent.setup()

describe('CodePushButton', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it('gets the metadata on mount', async () => {
    CodePush.getUpdateMetadata = jest.fn(() =>
      Promise.resolve({ label: 'V4', description: 'New Release !' } as LocalPackage)
    )

    render(<CodePushButton />)

    await waitFor(() => expect(CodePush.getUpdateMetadata).toHaveBeenCalledTimes(1))

    await screen.findByText('V4 (New Release !)')
  })

  it('gets the partial metadata when CodePush update metadata has partial information', async () => {
    CodePush.getUpdateMetadata = jest.fn(() => Promise.resolve({ label: 'V5' } as LocalPackage))

    render(<CodePushButton />)

    await waitFor(() => expect(CodePush.getUpdateMetadata).toHaveBeenCalledTimes(1))

    await screen.findByText('V5')
  })

  it('does not display info when CodePush update metadata is null', async () => {
    CodePush.getUpdateMetadata = jest.fn(() => Promise.resolve(null))

    render(<CodePushButton />)

    await waitFor(() => expect(CodePush.getUpdateMetadata).toHaveBeenCalledTimes(1))

    expect(screen.queryByText(/V\d/)).toBeNull()
  })

  it('prints that a new version is available if version mismatches', async () => {
    CodePush.sync = jest.fn((_, __, ___, mismatchCb) => {
      if (mismatchCb) {
        mismatchCb({} as RemotePackage)
      }
      return Promise.resolve(CodePush.SyncStatus.AWAITING_USER_ACTION)
    })

    render(<CodePushButton />)
    await user.press(screen.getByLabelText('Check update'))

    expect(CodePush.sync).toHaveBeenCalledTimes(1)

    await screen.findByText('Nouvelle version sur AppCenter')
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
      // We fake that a new version is available
      CodePush.sync = jest.fn((_options, syncCb) => {
        if (syncCb) {
          syncCb(status)
        }
        return Promise.resolve(status)
      })

      // We press the sync button
      render(<CodePushButton />)
      await user.press(screen.getByLabelText('Check update'))

      expect(CodePush.sync).toHaveBeenCalledTimes(1)

      // We expect our component to render the corresponding message status
      expect(screen.getByText(displayStatusMessage)).toBeTruthy()
    }
  )
})
