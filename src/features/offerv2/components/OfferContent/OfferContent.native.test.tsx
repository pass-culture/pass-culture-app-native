import React, { ComponentProps } from 'react'

import {
  CategoryIdEnum,
  HomepageLabelNameEnumv2,
  NativeCategoryIdEnumv2,
  OfferResponse,
  OnlineOfflinePlatformChoicesEnumv2,
  SearchGroupNameEnumv2,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnum,
} from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Subcategory } from 'libs/subcategories/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { OfferContent } from './OfferContent'

const mockSubcategory: Subcategory = {
  categoryId: CategoryIdEnum.CINEMA,
  appLabel: 'Cinéma plein air',
  searchGroupName: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
  homepageLabelName: HomepageLabelNameEnumv2.CINEMA,
  isEvent: true,
  onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnumv2.OFFLINE,
  nativeCategoryId: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
}

describe('<OfferContent />', () => {
  beforeEach(() => {
    mockServer.getApiV1<SubcategoriesResponseModelv2>('/subcategories/v2', placeholderData)
  })

  it('should display offer as a title', async () => {
    renderOfferContent({})

    expect(screen.getByText('Sous les étoiles de Paris - VF')).toBeOnTheScreen()
  })

  it('should display tags', async () => {
    renderOfferContent({})

    expect(screen.getByText('Cinéma plein air')).toBeOnTheScreen()
  })

  it('should display vinyl offer tags', () => {
    const offer: OfferResponse = {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
      extraData: { musicType: 'Metal', musicSubType: 'Industrial' },
    }
    const subcategory: Subcategory = {
      categoryId: CategoryIdEnum.MUSIQUE_ENREGISTREE,
      appLabel: 'Vinyles et autres supports',
      searchGroupName: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
      homepageLabelName: HomepageLabelNameEnumv2.MUSIQUE,
      isEvent: false,
      onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnumv2.OFFLINE,
      nativeCategoryId: NativeCategoryIdEnumv2.VINYLES,
    }

    renderOfferContent({
      offer,
      subcategory,
    })

    expect(screen.getByText('Metal')).toBeOnTheScreen()
    expect(screen.getByText('Industrial')).toBeOnTheScreen()
    expect(screen.getByText('Vinyles et autres supports')).toBeOnTheScreen()
  })

  it('should display artists', () => {
    const offer: OfferResponse = {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      extraData: { stageDirector: 'Marion Cotillard, Leonardo DiCaprio' },
    }
    renderOfferContent({
      offer,
    })

    expect(screen.getByText('de Marion Cotillard, Leonardo DiCaprio')).toBeOnTheScreen()
  })
})

type RenderOfferContentType = Partial<ComponentProps<typeof OfferContent>>

function renderOfferContent({
  offer = offerResponseSnap,
  subcategory = mockSubcategory,
}: RenderOfferContentType) {
  render(
    reactQueryProviderHOC(
      <OfferContent
        offer={offer}
        searchGroupList={placeholderData.searchGroups}
        subcategory={subcategory}
      />
    )
  )
}
