export type OpeningHour = {
  id?: number;
  dayOfWeek: number;
  period: 'morning' | 'afternoon';
  openTime: string;
  closeTime: string;
  userId?: string;
  centerId?: number;
  timeZone: string;
};
