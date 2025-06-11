export class PhrasesService {
  // Tableau de 6 phrases prédéfinies
  private phrases: string[] = [
    "Le chien est gris",
    "Le pneu est froid",
    "Le chat est doux",
    "La dent est lisse",
    "Le lion est brun",
    "Le train est vert"
  ];

  // Phrases restantes dans la série en cours (initialement vide)
  private remainingPhrases: string[] = [];

  /** Retourne une phrase aléatoire, en respectant l'unicité sur chaque série de 6 */
  public getRandomPhrase(): string {
    // Si toutes les phrases de la série précédente ont été utilisées, on redémarre une nouvelle série
    if (this.remainingPhrases.length === 0) {
      // On copie le tableau original des phrases pour éviter de le modifier directement
      this.remainingPhrases = [...this.phrases];
    }
    // Sélectionne un index aléatoire dans remainingPhrases, retire la phrase correspondante du tableau
    const randomIndex = Math.floor(Math.random() * this.remainingPhrases.length);
    const phraseChoisie = this.remainingPhrases.splice(randomIndex, 1)[0];  // retire l'élément:contentReference[oaicite:0]{index=0}
    return phraseChoisie;
  }

  /** (Optionnel) Retourne la liste complète des phrases possibles */
  public getAllPhrases(): string[] {
    return [...this.phrases];  // retourne une copie pour préserver l'encapsulation
  }
}
