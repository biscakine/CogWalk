import { formatDate } from '@nativescript/core';

export function formatFrenchDateTime(date: Date): string {
    // Create a date in Paris timezone
    const parisDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
    
    // French date format with custom formatting
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Paris'
    };

    return new Date(date).toLocaleString('fr-FR', options);
}