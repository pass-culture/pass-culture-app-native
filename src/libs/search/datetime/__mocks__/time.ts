import { TIMESTAMP as actualTimestamp } from '../time'

export const TIMESTAMP: typeof actualTimestamp = {
  getFirstOfDate: jest.fn(),
  getLastOfDate: jest.fn(),
  getFromDate: jest.fn(),
  getAllFromTimeRangeAndDates: jest.fn(),
  getAllFromTimeRangeAndDate: jest.fn(),
  WEEK_END: {
    getFirstFromDate: jest.fn(),
    getAllFromTimeRangeAndDate: jest.fn(),
  },
  WEEK: {
    getLastFromDate: jest.fn(),
    getAllFromTimeRangeAndDate: jest.fn(),
  },
}

export const computeTimeRangeFromHoursToSeconds = jest.fn()
