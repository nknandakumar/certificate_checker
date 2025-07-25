// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview This file defines a Genkit flow to complete missing certificate details using generative AI.
 *
 * It exports:
 * - `completeCertificateDetails`: An async function that takes a `CertificateDetails` object and attempts to fill in missing fields using an AI model.
 * - `CertificateDetails`: The input type definition for certificate details, including name, course name, and date.
 * - `CompletedCertificateDetails`: The output type definition for the completed certificate details.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CertificateDetailsSchema = z.object({
  name: z.string().optional().describe('The name of the certificate holder.'),
  courseName: z.string().optional().describe('The name of the course completed.'),
  date: z.string().optional().describe('The date of completion of the course.'),
});

export type CertificateDetails = z.infer<typeof CertificateDetailsSchema>;

const CompletedCertificateDetailsSchema = z.object({
  name: z.string().describe('The name of the certificate holder.'),
  courseName: z.string().describe('The name of the course completed.'),
  date: z.string().describe('The date of completion of the course.'),
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
  Course Name: {{courseName}}
  Date: {{date}}

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
