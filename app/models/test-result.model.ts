// app/models/test-result.model.ts
export interface TestResult {
  id: string;
  participantId: string;
  sessionId: string;   
  originalText: string;
  userInput: string;
  wordCount: number;
  timeTaken: number;
  errorCount: number;
  timestamp: number;
  date: Date;
  score: number;
}
