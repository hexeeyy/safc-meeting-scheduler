type CalendarView = 'month' | 'week' | 'day' | 'year' | 'schedule'

interface DateViewProps {
  activeView: CalendarView
}

export default function DateView({ activeView }: DateViewProps) {
  const now = new Date()

  const format = (date: Date) =>
    date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  const getDateLabel = () => {
    if (activeView === 'schedule') {
      const end = new Date(now)
      end.setFullYear(now.getFullYear() + 1)
      return `${format(now)} – ${format(end)}`
    }

    const options: Intl.DateTimeFormatOptions =
      activeView === 'day'
        ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        : activeView === 'week' || activeView === 'month'
        ? { year: 'numeric', month: 'long' }
        : { year: 'numeric' }

    return now.toLocaleDateString(undefined, options)
  }

  return (
    <div>
      {getDateLabel()}
    </div>
  )
}
