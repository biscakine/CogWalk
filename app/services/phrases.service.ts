// app/services/phrases.service.ts

export class PhrasesService {
  // La liste brute de tes 6 phrases
  private static readonly frenchPhrases = [
    "Le chien est gris",
    "Le pneu est froid",
    "Le chat est doux",
    "La dent est lisse",
    "Le lion est brun",
    "Le train est vert"
  ];

  constructor() {
    // vide : on peut toujours faire new PhrasesService()
  }

  /** Renvoie une copie de la liste complète des phrases */
  public getAllPhrases(): string[] {
    return [...PhrasesService.frenchPhrases];
  }

  /** (optionnel) Si tu as toujours besoin d’un tirage simple */
  public getRandomPhrase(): string {
    const list = this.getAllPhrases();
    const idx = Math.floor(Math.random() * list.length);
    return list[idx];
  }
}
