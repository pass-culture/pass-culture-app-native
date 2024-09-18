import { HomepageModule } from 'features/home/types'

export type ContentfulAdapter<Contentful, Module> = (module: Contentful) => Module | null

export class ContentfulAdapterFactory {
  private adapters: Map<string, ContentfulAdapter<any, HomepageModule>> = new Map()

  register<T>(type: string, adapter: ContentfulAdapter<T, HomepageModule>) {
    this.adapters.set(type, adapter)
  }

  getAdapter<T>(type: string): ContentfulAdapter<T, HomepageModule> | undefined {
    return this.adapters.get(type)
  }
}
