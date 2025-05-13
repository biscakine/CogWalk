// app/utils/date-formatter.ts
import { formatDate } from '@nativescript/core';

export function formatFrenchDateTime(date: Date): string {
  // Ex. : « 13/05/2025 19 h 42 »
  return formatDate(
    date,
    'dd/MM/yyyy HH:mm',
    'fr-FR',      // locale
    'Europe/Paris'
  );
}
