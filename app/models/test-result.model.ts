export interface TestResult {
  id: string;
  participantId: string;
  originalText: string;
  userInput: string;
  wordCount: number;
  timeTaken: number;
  errorCount: number;
  timestamp: Date;
  date: Date;
  score: number;
}
