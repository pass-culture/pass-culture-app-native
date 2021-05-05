import { Platform } from 'react-native'

import { isCompatible } from '../isCompatible'

interface Props {
  os: typeof Platform['OS']
  version: typeof Platform['Version']
  expected: boolean
}

describe('isCompatible', () => {
  it.each`
    os           | version   | expected
    ${'ios'}     | ${'9.0'}  | ${true}
    ${'ios'}     | ${'14.4'} | ${true}
    ${'ios'}     | ${'14.5'} | ${false}
    ${'ios'}     | ${'15.0'} | ${false}
    ${'ios'}     | ${'15.5'} | ${false}
    ${'android'} | ${20}     | ${true}
    ${'android'} | ${25}     | ${true}
  `(
    'should if the current os=$os and version=$version is compatible with tracking',
    ({ os, version, expected }: Props) => {
      Platform.OS = os
      Object.defineProperty(Platform, 'Version', { get: () => version })
      expect(isCompatible()).toEqual(expected)
    }
  )
})
