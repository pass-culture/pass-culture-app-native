import { getCodePushId } from './getCodePushId'

describe('getCodePushId', () => {
  it('should return empty string in web', () => {
    const codePushId = getCodePushId()
    expect(codePushId).toEqual('')
  })
})
