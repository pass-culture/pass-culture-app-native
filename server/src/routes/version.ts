import { readFileSync } from 'fs'
import { resolve } from 'path'

import { Request, Response } from 'express'

const version = JSON.parse(
  readFileSync(resolve(__dirname, '../..', 'package.json'), 'utf8')
).version

export function getVersion(req: Request, res: Response) {
  return res.send(version)
}
