import { storage } from 'libs/storage'

import { checkVenueSurveyAccess, markVenueSurveyAccess } from './venueSurveyAccessStorage'

const mockStorageReadString = jest.spyOn(storage, 'readString')
const mockStorageSaveString = jest.spyOn(storage, 'saveString')

describe('venueSurveyAccessStorage', () => {
  describe.each(['modal', 'banner'] as const)('%s type', (type) => {
    describe('checkVenueSurveyAccess', () => {
      it('should call storage.readString with the formatted storage key', async () => {
        await checkVenueSurveyAccess('DISTRIBUTION', type)

        expect(mockStorageReadString).toHaveBeenNthCalledWith(
          1,
          `DISTRIBUTION_${type}_venue_survey`
        )
      })

      it('should return true when value in storage is "true"', async () => {
        mockStorageReadString.mockResolvedValueOnce('true')

        const result = await checkVenueSurveyAccess('BOOKSHOP_AND_LIBRARY', type)

        expect(result).toBe(true)
      })

      it('should return false when value in storage is "false"', async () => {
        mockStorageReadString.mockResolvedValueOnce('false')

        const result = await checkVenueSurveyAccess('OUTINGS_AND_OTHERS', type)

        expect(result).toBe(false)
      })

      it('should return false when value in storage is null', async () => {
        mockStorageReadString.mockResolvedValueOnce(null)

        const result = await checkVenueSurveyAccess('DISTRIBUTION', type)

        expect(result).toBe(false)
      })
    })

    describe('markVenueSurveyAccess', () => {
      it('should save "true" in storage with the formatted key', async () => {
        await markVenueSurveyAccess('OUTINGS_AND_OTHERS', type)

        expect(mockStorageSaveString).toHaveBeenNthCalledWith(
          1,
          `OUTINGS_AND_OTHERS_${type}_venue_survey`,
          'true'
        )
      })
    })
  })
})
