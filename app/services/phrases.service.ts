export class PhrasesService {
  private static instance: PhrasesService;
  private readonly frenchPhrases = [
    "Le chien est gris",
    "Le pneu est froid",
    "Le chat est doux",
    "La dent est lisse",
    "Le lion est brun",
    "Le train est vert"
  ];
  private phraseQueue: string[] = [];

  private constructor() {
    this.resetQueue();
  }

  /** Singleton */
  static getInstance(): PhrasesService {
    if (!PhrasesService.instance) {
      PhrasesService.instance = new PhrasesService();
    }
    return PhrasesService.instance;
  }

  /** (Re)remplit et mélange la queue interne */
  private resetQueue() {
    this.phraseQueue = [...this.frenchPhrases];
    // Fisher–Yates shuffle
    for (let i = this.phraseQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.phraseQueue[i], this.phraseQueue[j]] =
        [this.phraseQueue[j], this.phraseQueue[i]];
    }
  }

  /** Renvoie la phrase suivante sans répétition dans un bloc de 6 */
  getRandomPhrase(): string {
    if (this.phraseQueue.length === 0) {
      this.resetQueue();
    }
    return this.phraseQueue.shift()!;
  }
}
