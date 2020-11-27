import { Offers, OffersWithCover, ProcessedModule } from './contentful'

export const isOfferModuleTypeguard = (
  module: ProcessedModule
): module is Offers | OffersWithCover =>
  module instanceof Offers || module instanceof OffersWithCover

export const isArrayOfOfferTypeguard = (
  modules: ProcessedModule[]
): modules is Array<Offers | OffersWithCover> =>
  modules.reduce<boolean>((acc: boolean, module) => acc && isOfferModuleTypeguard(module), true)
