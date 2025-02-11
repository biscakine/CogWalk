import { Email, compose } from '@nativescript/email';
import { TestResult } from '../models/test-result.model';
import { Session } from '../models/session.model';
import { File, Folder, knownFolders, path } from '@nativescript/core';

export class EmailService {
    private static instance: EmailService;
    private readonly recipientEmail = 'jerome.riera@univ-st-etienne.fr';

    private constructor() {}

    static getInstance(): EmailService {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }

    async sendSessionResults(session: Session, results: TestResult[]) {
        try {
            // Generate CSV content
            const csvContent = this.generateCSV(results);

            // Create temporary file
            const tempFolder = knownFolders.temp();
            const fileName = `session_${session.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().getTime()}.csv`;
            const filePath = path.join(tempFolder.path, fileName);
            const file = File.fromPath(filePath);
            await file.writeText(csvContent);

            // Compose email with attachment
            await compose({
                subject: `Résultats de la session: ${session.name}`,
                to: [this.recipientEmail],
                body: `Résultats de la session "${session.name}" du ${new Date(session.date).toLocaleDateString('fr-FR')}`,
                attachments: [{
                    fileName: fileName,
                    path: filePath,
                    mimeType: 'text/csv'
                }]
            });

            // Clean up temporary file
            if (File.exists(filePath)) {
                File.fromPath(filePath).remove();
            }

        } catch (error) {
            console.error('Error in sendSessionResults:', error);
            throw error;
        }
    }

    private generateCSV(results: TestResult[]): string {
        try {
            const headers = [
                'ID Participant',
                'Prénom',
                'Nom',
                'Texte Original',
                'Texte Saisi',
                'Nombre de Mots',
                'Temps (secondes)',
                'Nombre d\'erreurs',
                'Date du Test'
            ].join('\t');

            const rows = results.map(result => {
                if (!result || !result.participantId) return null;
                
                const [firstName, lastName] = result.participantId.split('_');
                return [
                    result.participantId,
                    this.escapeCSV(firstName),
                    this.escapeCSV(lastName),
                    this.escapeCSV(result.originalText),
                    this.escapeCSV(result.userInput),
                    result.wordCount,
                    result.timeTaken,
                    result.errorCount,
                    new Date(result.timestamp).toLocaleString('fr-FR')
                ].join('\t');
            }).filter(row => row !== null);

            if (rows.length === 0) {
                throw new Error('Aucune donnée valide à exporter');
            }

            return [headers, ...rows].join('\n');
        } catch (error) {
            console.error('Error generating CSV:', error);
            throw new Error('Erreur lors de la génération du fichier CSV');
        }
    }

    private escapeCSV(str: string): string {
        if (!str) return '';
        // Remove tabs and newlines
        return str.replace(/[\t\n\r]/g, ' ').trim();
    }
}