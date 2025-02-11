import { Observable } from '@nativescript/core';
import { TestResult } from '../models/test-result.model';

export class TestService extends Observable {
    private static instance: TestService;
    private static results: TestResult[] = [];

    private constructor() {
        super();
    }

    static getInstance(): TestService {
        if (!TestService.instance) {
            TestService.instance = new TestService();
        }
        return TestService.instance;
    }

    addResult(result: TestResult): void {
        console.log('Adding result:', JSON.stringify(result, null, 2));
        TestService.results.push(result);
        console.log('Total results after adding:', TestService.results.length);
        this.notifyPropertyChange('results', TestService.results);
    }

    calculateErrors(original: string, input: string): number {
        if (!original || !input) return 0;
        
        // Normalize strings: lowercase and trim
        const originalText = original.toLowerCase().trim();
        const inputText = input.toLowerCase().trim();
        
        const originalWords = originalText.split(' ');
        const inputWords = inputText.split(' ');
        
        let totalErrors = 0;
        let i = 0;
        let j = 0;
        
        while (i < originalWords.length && j < inputWords.length) {
            const originalWord = originalWords[i];
            const inputWord = inputWords[j];
            
            // Check for exact match
            if (originalWord === inputWord) {
                i++;
                j++;
                continue;
            }
            
            // Check for merged words
            if (inputWord.length > originalWord.length) {
                // Try to find if this input word contains multiple original words
                let remainingInput = inputWord;
                let tempI = i;
                let mergedWords = 0;
                let foundMerge = false;
                
                while (tempI < originalWords.length && remainingInput.length > 0) {
                    const currentOriginal = originalWords[tempI];
                    
                    if (remainingInput.startsWith(currentOriginal)) {
                        remainingInput = remainingInput.slice(currentOriginal.length);
                        tempI++;
                        mergedWords++;
                        if (remainingInput.length === 0) {
                            foundMerge = true;
                            totalErrors += mergedWords - 1; // Count one error per missing space
                            i = tempI;
                            j++;
                            break;
                        }
                    } else {
                        break;
                    }
                }
                
                if (!foundMerge) {
                    // If no clean merge found, count as a word error
                    totalErrors += 1;
                    i++;
                    j++;
                }
            } else {
                // Regular word difference
                totalErrors += 1;
                i++;
                j++;
            }
        }
        
        // Count remaining words as errors
        totalErrors += Math.abs((originalWords.length - i) - (inputWords.length - j));
        
        return totalErrors;
    }

    getResults(): TestResult[] {
        console.log('Getting results, current count:', TestService.results.length);
        console.log('Current results:', JSON.stringify(TestService.results, null, 2));
        return TestService.results;
    }

    clearResults(): void {
        TestService.results = [];
        this.notifyPropertyChange('results', TestService.results);
    }
}