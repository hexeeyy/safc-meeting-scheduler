type CalendarView = 'month' | 'week' | 'day' | 'agenda' | 'work_week';

interface DateViewProps {
  activeView: CalendarView;
}

export default function DateView({ activeView }: DateViewProps) {
  const now = new Date();

  const formatDate = (date: Date, options: Intl.DateTimeFormatOptions = {}) =>
    date.toLocaleDateString(undefined, options);

  const getDateLabel = (): string => {
    switch (activeView) {
      case 'agenda': {
        // For agenda view, we can show a month of agenda satring from the current date today sating june 23
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the month
        return `${formatDate(startOfMonth, { month: 'long', day: 'numeric' })} – ${formatDate(endOfMonth, {
          month: 'long',
          day: 'numeric',
        })}`;
      }

      case 'day':
        return formatDate(now, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'week':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Adjust to start of week (Sunday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)
        return `${formatDate(startOfWeek, { month: 'long', day: 'numeric' })} – ${formatDate(endOfWeek, {
          month: 'long',
          day: 'numeric',
        })}`;
      case 'month':
        return formatDate(now, {
          year: 'numeric',
          month: 'long',
        });

      case 'work_week':
        return now.getFullYear().toString();

      default:
        return '';
    }
  };

  return <div>{getDateLabel()}</div>;
}
