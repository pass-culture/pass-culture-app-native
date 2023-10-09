import { Request, Response } from 'express'

import { server } from '../../../tests/server'
import { getVersion } from '../version'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const version = JSON.parse(
  readFileSync(resolve(__dirname, '../../..', 'package.json'), 'utf8')
).version

const mockSend = jest.fn()
const req = {} as Request
const res = {
  send: mockSend
} as Partial<Response>

describe('version', () => {
  describe('with mock backend', () => {
    beforeAll(() => {
      server.listen()
    })

    afterAll(() => {
      server.resetHandlers()
      server.close()
    })

    it("should return version", async () => {
      await getVersion(req, res as Response)
      expect(mockSend).toBeCalledWith(version)
    })
  })
})
