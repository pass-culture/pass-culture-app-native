import {
  adaptedHomepage,
  formattedBusinessModule,
  formattedOffersModule,
} from 'features/home/fixtures/homepage.fixture'
import { homepageNatifEntryFixture } from 'libs/contentful/fixtures/homepageNatifEntry.fixture'
import { eventMonitoring } from 'libs/monitoring'

import { algoliaNatifModuleFixture } from '../fixtures/algoliaModules.fixture'
import { businessNatifModuleFixture } from '../fixtures/businessModule.fixture'

import { adaptHomepageEntries } from './adaptHomepageEntries'

describe('adaptHomepageEntries', () => {
  it('should adapt a list of HomepageNatifEntries without modules', () => {
    const adaptedHomepageList = adaptHomepageEntries([
      {
        ...homepageNatifEntryFixture,
        fields: { ...homepageNatifEntryFixture.fields, modules: [] },
      },
    ])

    expect(adaptedHomepageList).toStrictEqual([{ ...adaptedHomepage, modules: [] }])
  })

  describe('modules', () => {
    it('should adapt a list of HomepageNatifModules', () => {
      const rawHomepageNatifModules = [algoliaNatifModuleFixture, businessNatifModuleFixture]

      const formattedHomepageModules = [formattedOffersModule, formattedBusinessModule]
      const adaptedHomepageList = adaptHomepageEntries([
        {
          ...homepageNatifEntryFixture,
          fields: { ...homepageNatifEntryFixture.fields, modules: rawHomepageNatifModules },
        },
      ])

      expect(adaptedHomepageList).toStrictEqual([
        { ...adaptedHomepage, modules: formattedHomepageModules },
      ])
    })

    it('should catch the error and log to Sentry if the provided data is corrupted', () => {
      const spyWarn = jest.spyOn(global.console, 'warn').mockImplementationOnce(() => null)

      const contentModel = structuredClone(businessNatifModuleFixture)

      // @ts-ignore: the following content model is voluntarily broken, cf. PC-21362
      contentModel.fields.image = undefined

      adaptHomepageEntries([
        {
          ...homepageNatifEntryFixture,
          fields: { ...homepageNatifEntryFixture.fields, modules: [contentModel] },
        },
      ])

      expect(spyWarn).toHaveBeenNthCalledWith(
        1,
        'Error while computing home modules, with module of ID: 20SId61p6EFTG7kgBTFrOa',
        expect.objectContaining({}) // is supposed to be a TypeError, but we don't care
      )
      expect(eventMonitoring.captureException).toHaveBeenNthCalledWith(
        1,
        'Error while computing home modules',
        { extra: { moduleId: '20SId61p6EFTG7kgBTFrOa' } }
      )
    })
  })
})
