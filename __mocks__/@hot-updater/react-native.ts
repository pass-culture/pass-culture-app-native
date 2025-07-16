import { ReactNode } from 'react'

const getUpdateSource = jest.fn(() => Promise.resolve({ source: 'source' }))

const HotUpdater = jest.fn(() => (app: ReactNode) => app)

export default Object.assign(HotUpdater, {
  getUpdateSource,
})
