import CodePush, { LocalPackage } from 'react-native-code-push'

import { getCodePushId, metadataRef } from './getCodePushId'

const codePushSpy = jest.spyOn(CodePush, 'getUpdateMetadata')

describe('getCodePushId', () => {
  beforeEach(() => {
    metadataRef.hasFetchedMetadata = false
  })

  it('should return empty string when there is no code push information', async () => {
    codePushSpy.mockResolvedValueOnce(null)
    const codePushId = await getCodePushId()

    expect(codePushId).toEqual('')
  })

  it('should return code push label when there is code push information', async () => {
    codePushSpy.mockResolvedValueOnce({ label: 'V4' } as LocalPackage)
    const codePushId = await getCodePushId()

    expect(codePushId).toEqual('4')
  })

  it('should fetch metadata once', async () => {
    codePushSpy.mockResolvedValueOnce({ label: 'V4' } as LocalPackage)
    await getCodePushId()
    await getCodePushId()

    expect(codePushSpy).toHaveBeenCalledTimes(1)
  })

  it('should return empty string when there is an error', async () => {
    codePushSpy.mockRejectedValueOnce(new Error('CodePush error'))
    const codePushId = await getCodePushId()

    expect(codePushId).toEqual('')
  })
})
