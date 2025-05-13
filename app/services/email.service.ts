// app/services/email.service.ts
import { compose, AvailableComposeOptions } from '@nativescript/email';
import { knownFolders, path, File }           from '@nativescript/core';
import { Session }     from '../models/session.model';
import { TestResult }  from '../models/test-result.model';

/** Construit et envoie le mail avec un CSV en pièce jointe. */
export async function sendResultsMailCSV(
  session: Session,
  results: TestResult[]
): Promise<boolean> {

  // 1. Générer le contenu CSV
  const csv = buildCsv(results);

  // 2. Créer un fichier temporaire dans le dossier documents
  const documents = knownFolders.documents();
  const fileName  = `results-${session.id}.csv`;
  const filePath  = path.join(documents.path, fileName);
  const file      = File.fromPath(filePath);
  file.writeTextSync(csv);

  // 3. Préparer les options pour 'compose'
  const options: AvailableComposeOptions = {
    subject: `Résultats – ${session.name}`,
    body:    `Veuillez trouver ci-joint les résultats au format CSV.`,
    to:      ['destinataire@example.com'],
    attachments: [filePath]             // ← pièce jointe CSV
  };

  // 4. Ouvrir le composer natif ; renvoie true si l’utilisateur a envoyé le mail
  return await compose(options);
}

/** Convertit un tableau de résultats en CSV */
function buildCsv(results: TestResult[]): string {
  // En-tête
  const header = ['participantId', 'score', 'date'].join(',');
  // Lignes
  const lines = results.map(r =>
    [r.participantId, r.score, r.date.toISOString()].join(',')
  );
  return [header, ...lines].join('\n');
}
