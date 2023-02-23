import { formatISO, parseISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export function ISODateToObject(s: string): Date {
  return parseISO(s);
}

export function DateObjectToISODate(d: Date): string {
  const j = utcToZonedTime(d, "Asia/Tokyo");
  return formatISO(j);
}
