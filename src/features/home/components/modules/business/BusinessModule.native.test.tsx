import React from 'react'

import {
  BusinessModule,
  BusinessModuleProps,
} from 'features/home/components/modules/business/BusinessModule'
import { REDESIGN_AB_TESTING_HOME_MODULES } from 'libs/contentful/constants'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

const props: BusinessModuleProps = {
  analyticsTitle: 'Title of module',
  title: 'firstLine',
  subtitle: 'secondLine',
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  imageWeb:
    'https://images.ctfassets.net/2bg01iqy0isv/1jedJLjdDiypJqBtO1sjH0/185ee9e6428229a15d4c047b862a95f8/image_web.jpeg',
  url: 'url',
  moduleId: 'module-id',
  shouldTargetNotConnectedUsers: undefined,
  homeEntryId: 'abcd',
  index: 1,
  localizationArea: undefined,
  callToAction: 'En savoir plus',
  date: undefined,
}

const mockFeatureFlag = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)
const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('BusinessModule component', () => {
  describe('When shouldApplyGraphicRedesign remote config is false', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldApplyGraphicRedesign: false,
      })
    })

    it('should render NewBusinessModule if FF WIP_APP_V2_BUSINESS_BLOCK is on and home id not in REDESIGN_AB_TESTING_HOME_MODULES', () => {
      mockFeatureFlag.mockReturnValueOnce(true)
      renderBusinessModule(props)

      expect(screen.getByText('En savoir plus')).toBeOnTheScreen()
    })

    it('should render OldBusinessModule if FF WIP_APP_V2_BUSINESS_BLOCK is on and home id in REDESIGN_AB_TESTING_HOME_MODULES', () => {
      mockFeatureFlag.mockReturnValueOnce(true)
      renderBusinessModule({ ...props, homeEntryId: REDESIGN_AB_TESTING_HOME_MODULES[0] })

      expect(screen.queryByText('En savoir plus')).not.toBeOnTheScreen()
    })
  })

  describe('When shouldApplyGraphicRedesign remote config is true', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldApplyGraphicRedesign: true,
      })
    })

    it('should render NewBusinessModule if FF WIP_APP_V2_BUSINESS_BLOCK is on and home id not in REDESIGN_AB_TESTING_HOME_MODULES', () => {
      mockFeatureFlag.mockReturnValueOnce(true)
      renderBusinessModule(props)

      expect(screen.getByText('En savoir plus')).toBeOnTheScreen()
    })

    it('should render NewBusinessModule if FF WIP_APP_V2_BUSINESS_BLOCK is on and home id in REDESIGN_AB_TESTING_HOME_MODULES', () => {
      mockFeatureFlag.mockReturnValueOnce(true)
      renderBusinessModule({ ...props, homeEntryId: REDESIGN_AB_TESTING_HOME_MODULES[0] })

      expect(screen.getByText('En savoir plus')).toBeOnTheScreen()
    })
  })

  it('should render OldBusinessModule if FF WIP_APP_V2_BUSINESS_BLOCK is off', async () => {
    mockFeatureFlag.mockReturnValueOnce(false)
    renderBusinessModule(props)

    expect(screen.queryByText('En savoir plus')).not.toBeOnTheScreen()
  })
})

const renderBusinessModule = (props: BusinessModuleProps) =>
  render(reactQueryProviderHOC(<BusinessModule {...props} />))
