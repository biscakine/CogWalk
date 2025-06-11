export class PhrasesService {
  private static readonly list = [
    "Le chien est gris",
    "Le pneu est froid",
    "Le chat est doux",
    "La dent est lisse",
    "Le lion est brun",
    "Le train est vert"
  ];
  private static queue: string[] = [];

  /** Initialise ou reshuffle la queue si vide */
  private static ensureQueue() {
    if (PhrasesService.queue.length === 0) {
      PhrasesService.queue = [...PhrasesService.list].sort(() => Math.random() - 0.5);
      console.log("[PhrasesService] reset queue:", PhrasesService.queue);
    }
  }

  /** Renvoie la phrase suivante, sans répétition sur 6 tirages */
  getRandomPhrase(): string {
    PhrasesService.ensureQueue();
    const p = PhrasesService.queue.shift()!;
    console.log("[PhrasesService] pick:", p, "| remaining:", PhrasesService.queue);
    return p;
  }
}
