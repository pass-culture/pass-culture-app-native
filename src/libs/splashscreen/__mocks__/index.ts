import React from 'react'

export const useSplashScreenContext = jest
  .fn()
  .mockReturnValue({ isSplashScreenHidden: true, hideSplashScreen: jest.fn() })

export const SplashScreenProvider: React.FC<{ children: React.ReactElement }> = (props) =>
  props.children
