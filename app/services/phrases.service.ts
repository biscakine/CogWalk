export class PhrasesService {
  private frenchPhrases = [
    // 3 words
    "Je mange bien",
    "Il fait beau",
    "Nous marchons ensemble",
    "Elle dort paisiblement",
    "Le chat dort",
    "Tu lis beaucoup",
    "Il pleut fort",
    "La mer brille",
    "Le soleil brille",
    "Les oiseaux chantent",
    
    // 4 words
    "Je mange une pomme",
    "La voiture est rouge",
    "Il fait très beau",
    "Les enfants jouent dehors",
    "Je bois du café",
    "Le chat joue doucement",
    "La pluie tombe fort",
    "Elle danse très bien",
    "Nous aimons la musique",
    "Le train part maintenant",
    
    // 5 words
    "J'aime lire des bons livres",
    "Le soleil brille très fort",
    "Les fleurs sont très jolies",
    "La maison est très grande",
    "Je vais souvent au cinéma",
    "Le vent souffle très doucement",
    "Les oiseaux volent très haut",
    "Nous marchons dans le parc",
    "Elle écoute de la musique",
    "Il mange avec ses amis",
    
    // 6 words
    "Le chat dort sur le lit",
    "Je mange du pain au chocolat",
    "Les enfants jouent dans le jardin",
    "Elle aime beaucoup lire des livres",
    "Nous allons souvent à la plage",
    "Il fait très beau ce jour",
    "La musique résonne dans la maison",
    "Les oiseaux chantent dans les arbres",
    "Le soleil brille dans le ciel",
    "La pluie tombe sur le toit",
    
    // 7 words
    "Le chat noir dort sur le lit",
    "Je mange une pomme tous les jours",
    "Les enfants jouent au ballon dehors aujourd'hui",
    "Elle lit un livre dans le jardin",
    "Nous marchons le long de la plage",
    "Il fait très beau temps ce matin",
    "La musique joue doucement dans le salon",
    "Les oiseaux volent haut dans le ciel",
    "Le soleil brille fort dans le ciel",
    "La pluie tombe doucement sur les fleurs"
  ];

  getRandomPhrase(wordCount: number): string {
    // Filter phrases that match exactly the requested word count
    const filteredPhrases = this.frenchPhrases.filter(
      phrase => phrase.split(' ').length === wordCount
    );
    
    if (filteredPhrases.length === 0) {
      throw new Error(`No phrases available with exactly ${wordCount} words`);
    }
    
    // Get a truly random phrase from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredPhrases.length);
    return filteredPhrases[randomIndex];
  }
}