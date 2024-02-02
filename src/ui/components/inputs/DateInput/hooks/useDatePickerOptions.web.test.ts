import { dayNumbers } from 'shared/date/days'
import { monthNames, monthNamesShort } from 'shared/date/months'
import { renderHook } from 'tests/utils/web'
import { useDatePickerOptions } from 'ui/components/inputs/DateInput/hooks/useDatePickerOptions'

describe('useDatePickerOptions', () => {
  it('should return default options if date is not fully defined', () => {
    const { result } = renderHook(() =>
      useDatePickerOptions({
        date: { day: '13', month: 'Décembre' },
        minimumYear: 2000,
        maximumYear: 2001,
      })
    )

    expect(result.current.optionGroups).toEqual({
      month: monthNames,
      day: dayNumbers,
      year: ['2001', '2000'],
    })
  })

  it('should return options based on date if date is fully defined', () => {
    const { result } = renderHook(() =>
      useDatePickerOptions({
        date: { day: '13', month: 'Février', year: '2000' },
        minimumYear: 2000,
        maximumYear: 2004,
      })
    )

    expect(result.current.optionGroups).toEqual({
      month: monthNames,
      day: dayNumbers.slice(0, 29),
      year: ['2004', '2003', '2002', '2001', '2000'],
    })
  })

  it('should return options with short month names if asked', () => {
    const { result } = renderHook(() =>
      useDatePickerOptions({
        date: { day: '13', month: 'Décembre', year: '2000' },
        minimumYear: 2000,
        maximumYear: 2004,
        monthNamesType: 'short',
      })
    )

    expect(result.current.optionGroups).toEqual({
      month: monthNamesShort,
      day: dayNumbers,
      year: ['2004', '2003', '2002', '2001', '2000'],
    })
  })
})
