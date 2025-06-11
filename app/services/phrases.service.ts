export class PhrasesService {
  private static readonly frenchPhrases = [
    "Le chien est gris",
    "Le pneu est froid",
    "Le chat est doux",
    "La dent est lisse",
    "Le lion est brun",
    "Le train est vert"
  ];

  // Queue partagée par **toutes** les instances
  private static phraseQueue: string[] = [];

  constructor() {
    // rien ici : on veut pouvoir faire new PhrasesService()
  }

  /** Remplit et mélange la queue */
  private static resetQueue(): void {
    PhrasesService.phraseQueue = [...PhrasesService.frenchPhrases];
    for (let i = PhrasesService.phraseQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [PhrasesService.phraseQueue[i], PhrasesService.phraseQueue[j]] =
        [PhrasesService.phraseQueue[j], PhrasesService.phraseQueue[i]];
    }
    console.log('[PhrasesService] resetQueue =>', PhrasesService.phraseQueue);
  }

  /** Tire la prochaine phrase en évitant les répétitions sur 6 appels */
  public getRandomPhrase(): string {
    if (PhrasesService.phraseQueue.length === 0) {
      PhrasesService.resetQueue();
    }
    const phrase = PhrasesService.phraseQueue.shift()!;
    console.log('[PhrasesService] getRandomPhrase →', phrase, '; remaining:', PhrasesService.phraseQueue);
    return phrase;
  }
}
