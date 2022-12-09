import { VenuesModule, ProcessedModule } from 'libs/contentful/moduleTypes'

import { Offers, OffersWithCover } from '../../libs/contentful'

export const isOfferModuleTypeguard = (
  module: ProcessedModule
): module is Offers | OffersWithCover =>
  module instanceof Offers || module instanceof OffersWithCover

export const isArrayOfOfferTypeguard = (
  modules: ProcessedModule[]
): modules is Array<Offers | OffersWithCover> =>
  modules.reduce<boolean>((acc: boolean, module) => acc && isOfferModuleTypeguard(module), true)

export const isVenuesModuleTypeguard = (module: ProcessedModule): module is VenuesModule =>
  module instanceof VenuesModule

export const isArrayOfVenuesTypeguard = (
  modules: ProcessedModule[]
): modules is Array<VenuesModule> =>
  modules.reduce<boolean>((acc: boolean, module) => acc && isVenuesModuleTypeguard(module), true)
