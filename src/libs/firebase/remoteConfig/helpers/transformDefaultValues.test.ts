import { transformDefaultValues } from 'libs/firebase/remoteConfig/helpers/transformDefaultValues'

describe('transformDefaultValues', () => {
  it('should transform objects and arrays to string', () => {
    expect(
      transformDefaultValues({
        param1: 1,
        param2: false,
        param3: { foo: 'bar', biz: [1, 2, 3] },
        param4: ['foo', 'bar', 'biz'],
        param5: 'this is a string',
      })
    ).toEqual({
      param1: 1,
      param2: false,
      param3: JSON.stringify({ foo: 'bar', biz: [1, 2, 3] }),
      param4: JSON.stringify(['foo', 'bar', 'biz']),
      param5: 'this is a string',
    })
  })
})
