export class PhrasesService {
  // Ta liste fixe
  private static readonly frenchPhrases = [
    "Le chien est gris",
    "Le pneu est froid",
    "Le chat est doux",
    "La dent est lisse",
    "Le lion est brun",
    "Le train est vert"
  ];

  // Une queue statique partagée par toutes les instances
  private static phraseQueue: string[] = [];

  constructor() {
    // rien ici : on ne veut pas empêcher "new PhrasesService()"
  }

  /** (Re)remplit et mélange la queue */
  private static resetQueue(): void {
    // copie et shuffle Fisher–Yates
    PhrasesService.phraseQueue = [...PhrasesService.frenchPhrases];
    for (let i = PhrasesService.phraseQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [PhrasesService.phraseQueue[i], PhrasesService.phraseQueue[j]] =
        [PhrasesService.phraseQueue[j], PhrasesService.phraseQueue[i]];
    }
  }

  /** Renvoie la phrase suivante, sans répétition sur 6 appels */
  public getRandomPhrase(): string {
    if (PhrasesService.phraseQueue.length === 0) {
      PhrasesService.resetQueue();
    }
    // shift renvoie et retire la première entrée
    return PhrasesService.phraseQueue.shift()!;
  }
}
