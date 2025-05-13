// app/services/email.service.ts
import { compose, ComposeOptions, Attachment } from '@nativescript/email';
import { knownFolders, path, File } from '@nativescript/core';
import { Session }    from '../models/session.model';
import { TestResult } from '../models/test-result.model';

export class EmailService {
  // ───────── SINGLETON ──────────
  private static _instance: EmailService;
  static getInstance(): EmailService {
    if (!this._instance) {
      this._instance = new EmailService();
    }
    return this._instance;
  }
  private constructor() {}

  // ───────── API publique ───────
  /** Exporte les résultats de session en CSV et ouvre le composer natif. */
  async sendSessionResults(session: Session, results: TestResult[]): Promise<boolean> {
    const csvPath = this.writeCsvToTemp(session, results);

    const attachments: Attachment[] = [{
      path: csvPath,
      fileName: `results-${session.id}.csv`,
      mimeType: 'text/csv',
    }];

    const options: ComposeOptions = {
      subject: `Résultats – ${session.name}`,
      body:    'Veuillez trouver ci-joint les résultats au format CSV.',
      to:      ['destinataire@example.com'],
      attachments,
    };

    return compose(options);
  }

  // ───────── utilitaires privés ─
  private writeCsvToTemp(session: Session, results: TestResult[]): string {
    const csv = this.buildCsv(results);

    const docs     = knownFolders.documents();
    const fileName = `results-${session.id}.csv`;
    const filePath = path.join(docs.path, fileName);
    File.fromPath(filePath).writeTextSync(csv);

    return filePath;
  }

  private buildCsv(results: TestResult[]): string {
    const header = ['participantId', 'score', 'date'].join(',');
    const rows = results.map(r =>
      [r.participantId, r.score, r.date.toISOString()].join(',')
    );
    return [header, ...rows].join('\n');
  }
}
