// app/services/email.service.ts
//------------------------------------------------------------
// Service d’envoi d’e-mails avec pièce jointe CSV
//------------------------------------------------------------
import { compose, ComposeOptions } from '@nativescript/email';
import { knownFolders, path, File } from '@nativescript/core';
import { Session }     from '../models/session.model';
import { TestResult }  from '../models/test-result.model';

export class EmailService {
  /**
   * Construit un CSV à partir des résultats et ouvre le compositeur d’e-mail.
   * @returns true si l’utilisateur a effectivement envoyé le courriel.
   */
  static async sendResultsMailCSV(
    session: Session,
    results: TestResult[],
    recipient = 'destinataire@example.com'
  ): Promise<boolean> {
    // 1. Générer le texte CSV
    const csvContent = buildCsv(results);

    // 2. Écrire le fichier dans Documents/
    const documents = knownFolders.documents();
    const fileName  = `results-${session.id}.csv`;
    const filePath  = path.join(documents.path, fileName);
    const csvFile   = File.fromPath(filePath);
    csvFile.writeTextSync(csvContent);

    // 3. Préparer les options du compositeur natif
    const options: ComposeOptions = {
      subject: `Résultats – ${session.name}`,
      body:    `Veuillez trouver ci-joint les résultats au format CSV.`,
      to:      [recipient],
      attachments: [filePath],   // chemin absolu vers le CSV
      // iOS : si vous voulez forcer le MIME :
      // attachments: [{ path: filePath, fileName, mimeType: 'text/csv' }]
    };

    try {
      const sent = await compose(options);
      return sent;               // true si l’utilisateur appuie sur « Envoyer »
    } finally {
      // (Facultatif) Nettoyer le fichier temporaire
      // await csvFile.remove();
    }
  }
}

/**
 * Convertit un tableau de TestResult en chaîne CSV.
 * @example
 * participantId,score,date
 * p1,87,2025-05-13T18:05:42.123Z
 */
function buildCsv(results: TestResult[]): string {
  const header = ['participantId', 'score', 'date'].join(',');
  const lines  = results.map(r =>
    [r.participantId, r.score, r.date.toISOString()].join(',')
  );
  return [header, ...lines].join('\n');
}

