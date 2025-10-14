export const useOpeningHours = () => {
  const now = new Date();
  const day = now.getDay();

  const CLOSED_DAY = 2; // Tuesday
  const MONDAY = 1;
  const MONDAY_OPENING_HOUR = 16;
  const OPENING_HOUR = 12;
  const CLOSING_HOUR = 22.5;

  const hours = now.getHours();
  const minutes = now.getMinutes();

  if (hours > 23 || minutes > 59) throw new Error("Invalid time");

  const currentTime = hours + minutes / 60;
  const isClosed = day === CLOSED_DAY;
  const openingHour = day === MONDAY ? MONDAY_OPENING_HOUR : OPENING_HOUR;
  const isOpen = !isClosed && currentTime >= openingHour && currentTime < CLOSING_HOUR;

  const formatDay = new Intl.DateTimeFormat('de-DE', { weekday: 'long' }).format;

  const nextOpeningTime = (() => {
    if (isClosed) return 'Mittwoch ab 12:00 Uhr wieder geöffnet';
    if (currentTime < openingHour) {
      return day === MONDAY ? 'heute ab 16:00 Uhr wieder geöffnet' : 'heute ab 12:00 Uhr wieder geöffnet';
    }
    if (currentTime >= CLOSING_HOUR) {
      let nextDay = new Date(now);
      nextDay.setDate(nextDay.getDate() + 1);
      while (nextDay.getDay() === CLOSED_DAY) {
        nextDay.setDate(nextDay.getDate() + 1);
      }
      const nextDayIsMonday = nextDay.getDay() === MONDAY;
      const nextOpenTime = nextDayIsMonday ? '16:00' : '12:00';
      return `${formatDay(nextDay)} ab ${nextOpenTime} Uhr wieder geöffnet`;
    }
    return '';
  })();

  const currentHoursDisplay = isClosed
    ? 'Ruhetag'
    : day === MONDAY
      ? '16:00–22:30'
      : '12:00–22:30';

  return {
    isOpen,
    openingTime: isClosed ? 0 : openingHour,
    closingTime: isClosed ? 0 : CLOSING_HOUR,
    nextOpeningTime,
    currentHours: currentHoursDisplay,
    isTuesday: isClosed
  };
};
