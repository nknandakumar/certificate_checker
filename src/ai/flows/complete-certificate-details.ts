// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview This file defines a Genkit flow to complete missing certificate details using generative AI.
 *
 * It exports:
 * - `completeCertificateDetails`: An async function that takes a `CertificateDetails` object and attempts to fill in missing fields using an AI model.
 * - `CertificateDetails`: The input type definition for certificate details, including name, course, completion date, and grade.
 * - `CompletedCertificateDetails`: The output type definition for the completed certificate details.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CertificateDetailsSchema = z.object({
  name: z.string().optional().describe('The name of the certificate holder.'),
  course: z.string().optional().describe('The name of the course completed.'),
  completionDate: z.string().optional().describe('The date of completion of the course.'),
  grade: z.string().optional().describe('The grade achieved in the course.'),
});

export type CertificateDetails = z.infer<typeof CertificateDetailsSchema>;

const CompletedCertificateDetailsSchema = z.object({
  name: z.string().describe('The name of the certificate holder.'),
  course: z.string().describe('The name of the course completed.'),
  completionDate: z.string().describe('The date of completion of the course.'),
  grade: z.string().describe('The grade achieved in the course.'),
});

export type CompletedCertificateDetails = z.infer<typeof CompletedCertificateDetailsSchema>;

export async function completeCertificateDetails(details: CertificateDetails): Promise<CompletedCertificateDetails> {
  return completeCertificateDetailsFlow(details);
}

const completeCertificateDetailsPrompt = ai.definePrompt({
  name: 'completeCertificateDetailsPrompt',
  input: {schema: CertificateDetailsSchema},
  output: {schema: CompletedCertificateDetailsSchema},
  prompt: `You are an AI assistant that helps to complete certificate details, given potentially incomplete information.

  Given the following certificate details, fill in any missing information. If all information is present, return the data as is.  If some information is missing, use your knowledge to make a best guess about the missing data.

  Name: {{name}}
  Course: {{course}}
  Completion Date: {{completionDate}}
  Grade: {{grade}}

  Ensure that all fields are populated in the response.
  `,
});

const completeCertificateDetailsFlow = ai.defineFlow(
  {
    name: 'completeCertificateDetailsFlow',
    inputSchema: CertificateDetailsSchema,
    outputSchema: CompletedCertificateDetailsSchema,
  },
  async input => {
    const {output} = await completeCertificateDetailsPrompt(input);
    return output!;
  }
);
