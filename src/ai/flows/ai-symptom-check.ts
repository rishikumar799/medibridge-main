
'use server';
/**
 * @fileOverview This file defines a Genkit flow for AI-powered symptom analysis.
 *
 * The flow allows users to input their symptoms via text or voice (in Telugu or English)
 * and receive an AI-powered analysis to understand potential health concerns.
 *
 * @exports {
 *   analyzeSymptoms - The main function to trigger the symptom analysis flow.
 *   SymptomAnalysisInput - The input type for the analyzeSymptoms function.
 *   SymptomAnalysisOutput - The return type for the analyzeSymptoms function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the symptom analysis flow.
 */
const SymptomAnalysisInputSchema = z.object({
  symptoms:
    z.string()
      .describe(
        'A description of the symptoms experienced by the user, which can be in English or Telugu. It can be a comma-separated list or a free-form text.'
      ),
});

/**
 * Type definition for the input to the symptom analysis flow.
 */
export type SymptomAnalysisInput = z.infer<typeof SymptomAnalysisInputSchema>;

/**
 * Output schema for the symptom analysis flow.
 */
const SymptomAnalysisOutputSchema = z.object({
  analysis: z.array(z.object({
    title: z.string(),
    points: z.array(z.string()),
  })).describe(
        'An AI-powered analysis of the symptoms. Provide a structured response with titles like "Initial Analysis", "Suggested First Aid", "Recommended Diet Plan", "Recommended Tests", and "Disclaimer".'
      ),
  recommendedSpecialist: z.string().describe("Based on the symptoms, recommend a single, appropriate specialist type to consult (e.g., 'General Physician', 'Cardiologist', 'Dermatologist')."),
});

/**
 * Type definition for the output of the symptom analysis flow.
 */
export type SymptomAnalysisOutput = z.infer<typeof SymptomAnalysisOutputSchema>;

/**
 * Analyzes the provided symptoms and returns an AI-powered analysis.
 * @param input - The input containing the user-provided symptoms.
 * @returns A promise resolving to the symptom analysis output.
 */
export async function analyzeSymptoms(input: SymptomAnalysisInput): Promise<SymptomAnalysisOutput> {
  return analyzeSymptomsFlow(input);
}

/**
 * Prompt definition for the symptom analysis.
 */
const symptomAnalysisPrompt = ai.definePrompt({
  name: 'symptomAnalysisPrompt',
  input: {schema: SymptomAnalysisInputSchema},
  output: {schema: SymptomAnalysisOutputSchema},
  prompt: `You are an AI-powered health assistant. Your goal is to provide a helpful, preliminary analysis of a user's symptoms. The user can provide symptoms in English or Telugu. Respond in simple, easy-to-understand language.

Analyze the user's symptoms and provide a structured response, with each section having a title and an array of points. The sections should be:

1.  **Initial Analysis**: Start with a brief, non-alarming potential reason for the symptoms. (1-2 points)
2.  **Suggested First Aid**: Provide 2-3 simple, natural first-aid or home care tips.
3.  **Recommended Diet Plan**: Suggest a top-level diet plan (e.g., "focus on liquids and easily digestible foods"). (2-3 points)
4.  **Recommended Tests**: Recommend 1-2 relevant diagnostic tests for discussion with a doctor.
5.  **Disclaimer**: Conclude with a strong, clear disclaimer emphasizing that this is not a medical diagnosis and that the user must consult a qualified doctor for any health concerns.

Based on the symptoms, also provide a recommendation for the single most appropriate specialist to consult.

User Symptoms: {{{symptoms}}}
`,
});

/**
 * Genkit flow for analyzing symptoms.
 */
const analyzeSymptomsFlow = ai.defineFlow(
  {
    name: 'analyzeSymptomsFlow',
    inputSchema: SymptomAnalysisInputSchema,
    outputSchema: SymptomAnalysisOutputSchema,
  },
  async input => {
    const {output} = await symptomAnalysisPrompt(input);
    return output!;
  }
);
