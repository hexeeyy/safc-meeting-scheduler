type CalendarView = 'month' | 'week' | 'day' | 'agenda' | 'work_week';

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
        endOfWeek.setDate(startOfWeek.getDate() + 7 - startOfWeek.getDay() - 1); // Adjust to end of week (Saturday)
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        return `${formatDate(startOfWeek, { month: 'long', day: 'numeric' })} – ${formatDate(endOfWeek, {
          month: 'long',
          day: 'numeric',
        })}`;
      }

      case 'work_week': {
        const day = date.getDay(); // Sunday = 0
        const diffToMonday = (day + 6) % 7;
        const monday = new Date(date);
        monday.setDate(date.getDate() - diffToMonday);
        const friday = new Date(monday);
        friday.setDate(monday.getDate() + 4);
        return `${formatDate(monday, { month: 'long', day: 'numeric' })} – ${formatDate(friday, {
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