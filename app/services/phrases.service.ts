export class PhrasesService {
  private frenchPhrases = [
    "Le chien est gris",
    "le pneu est froid",
    "Le chat est doux",
    "La dent est lisse",
    "Le lion est brun",
    "Le train est vert"
  ];

  getRandomPhrase(): string {
    const randomIndex = Math.floor(Math.random() * this.frenchPhrases.length);
    return this.frenchPhrases[randomIndex];
  }
}