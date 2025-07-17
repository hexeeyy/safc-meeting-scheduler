type CalendarView = 'month' | 'week' | 'day' | 'agenda';

interface DateViewProps {
  activeView: CalendarView;
  date: Date;
}

export default function DateView({ activeView, date }: DateViewProps) {
  const formatDate = (date: Date, options: Intl.DateTimeFormatOptions = {}) =>
    date.toLocaleDateString(undefined, options);

  const getDateLabel = (): string => {
    switch (activeView) {
      case 'agenda': {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return `${formatDate(startOfMonth, { month: 'long', day: 'numeric' })} – ${formatDate(endOfMonth, {
          month: 'long',
          day: 'numeric',
        })}`;
      }

      case 'day':
        return formatDate(date, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

      case 'week': {
        const startOfWeek = new Date(date);
        const endOfWeek = new Date(date);
        endOfWeek.setDate(startOfWeek.getDate() + 7 - startOfWeek.getDay() - 1);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        return `${formatDate(startOfWeek, { month: 'long', day: 'numeric' })} – ${formatDate(endOfWeek, {
          month: 'long',
          day: 'numeric',
        })}`;
      }

      case 'month':
        return formatDate(date, {
          year: 'numeric',
          month: 'long',
        });

      default:
        return '';
    }
  };

  return <div>{getDateLabel()}</div>;
}