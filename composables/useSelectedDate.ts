import type { DateValue } from '@internationalized/date'
import { today, getLocalTimeZone } from '@internationalized/date'
import { format } from 'date-fns'

export const useSelectedDate = () => {
  const selectedDate = useState<DateValue>('selectedDate', () => today(getLocalTimeZone()))
  const selectedDayIsToday = computed(() => selectedDate.value.compare(today(getLocalTimeZone())) === 0)
  const formattedSelectedDate = computed(() => {
    const date = selectedDate.value.toDate(getLocalTimeZone())
    return format(date, 'MMM d, yyyy')
  })

  return {
    selectedDate,
    selectedDayIsToday,
    formattedSelectedDate,
  }
}
