export class PhrasesService {
  private static readonly frenchPhrases = [
    "Le chien est gris",
    "Le pneu est froid",
    "Le chat est doux",
    "La dent est lisse",
    "Le lion est brun",
    "Le train est vert"
  ];

  constructor() { /* vide */ }

  /** Renvoie une copie de la liste complète */
  public getAllPhrases(): string[] {
    return [...PhrasesService.frenchPhrases];
  }
}
