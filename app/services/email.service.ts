import { knownFolders, File } from '@nativescript/core';
import { compose, ComposeOptions } from 'nativescript-email';
import { SessionService } from './session.service';
import { ParticipantService } from './participant.service';
import { TestService } from './test.service';
import { TestResult } from '../models/test-result.model';

export class EmailService {
  private sessionSvc = SessionService.getInstance();
  private participantSvc = ParticipantService.getInstance();
  private testSvc = TestService.getInstance();

  /**
   * Génère un CSV des résultats pour la session donnée.
   * @param sessionId L'ID de la session à exporter.
   * @returns Le chemin du fichier CSV généré.
   */
  private buildCsv(sessionId: string): string {
    // Récupère tous les essais de la session
    const allResults: TestResult[] = this.testSvc.getResults()
      .filter(r => r.sessionId === sessionId);

    // Header
    const header = ['Nom', 'Prénom', 'Phrase proposée', 'Phrase rédigée', 'Temps (ms)'].join(',');

    // Lignes
    const lines = allResults.map(result => {
      const participant = this.participantSvc.getParticipantById(result.participantId);
      // Échapper les guillemets éventuels dans les phrases
      const original = `"${result.originalText.replace(/"/g, '""')}"`;
      const input    = `"${result.userInput.replace(/"/g, '""')}"`;
      return [
        participant.lastName,
        participant.firstName,
        original,
        input,
        result.timeTaken.toString()
      ].join(',');
    });

    const csvContent = [header, ...lines].join('\n');

    // Sauvegarde dans un fichier
    const documents = knownFolders.documents();
    const filePath = `${documents.path}/cogwalk-results-${sessionId}.csv`;
    const file = File.fromPath(filePath);
    file.writeText(csvContent);

    return filePath;
  }

  /**
   * Compose et ouvre le mail avec le CSV en pièce jointe.
   * @param sessionId L'ID de la session dont on veut exporter les résultats.
   */
  public async sendSessionResults(sessionId: string): Promise<void> {
    const session = this.sessionSvc.getSessionById(sessionId);
    const csvPath = this.buildCsv(sessionId);

    const options: ComposeOptions = {
      subject: `Résultats CogWalk – Session "${session.name}"`,
      body: `Bonjour,\n\nVeuillez trouver en pièce jointe le rapport CSV des essais pour la session "${session.name}" du ${new Date(session.createdAt).toLocaleDateString()}.\n\nCordialement,\nL'équipe CogWalk.`,
      to: [], // laisser vide pour saisie manuelle ou mettre une adresse par défaut
      attachments: [
        {
          fileName: `cogwalk-results-${session.name}.csv`,
          path: csvPath,
          mimeType: 'text/csv',
        }
      ]
    };

    try {
      await compose(options);
    } catch (err) {
      console.error('Échec de l’ouverture du composeur mail:', err);
    }
  }
}
