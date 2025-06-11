export class PhrasesService {
  // La liste brute de tes 6 phrases
  private static readonly list = [
    "Le chien est gris",
    "Le pneu est froid",
    "Le chat est doux",
    "La dent est lisse",
    "Le lion est brun",
    "Le train est vert"
  ];

  // La queue statique partagée par toutes les instances
  private static queue: string[] = [];

  /** 
   * Initialise ou reshuffle la queue si elle est vide.
   * On y met une copie mélangée de la "list".
   */
  private static ensureQueue(): void {
    if (PhrasesService.queue.length === 0) {
      PhrasesService.queue = [...PhrasesService.list];
      // Fisher–Yates shuffle
      for (let i = PhrasesService.queue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [PhrasesService.queue[i], PhrasesService.queue[j]] =
          [PhrasesService.queue[j], PhrasesService.queue[i]];
      }
      console.log("[PhrasesService] reset queue:", PhrasesService.queue);
    }
  }

  /**
   * Renvoie la phrase suivante, sans répétition avant épuisement des 6.
   */
  public getRandomPhrase(): string {
    PhrasesService.ensureQueue();
    const phrase = PhrasesService.queue.shift()!;
    console.log("[PhrasesService] pick:", phrase, "| remaining:", PhrasesService.queue);
    return phrase;
  }
}
