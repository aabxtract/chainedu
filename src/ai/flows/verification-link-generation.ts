'use server';

/**
 * @fileOverview Flow for generating a temporary, cryptographically signed link for verifying student academic records.
 *
 * - generateVerificationLink - A function that generates the verification link.
 * - VerificationLinkInput - The input type for the generateVerificationLink function.
 * - VerificationLinkOutput - The return type for the generateVerificationLink function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerificationLinkInputSchema = z.object({
  studentId: z.string().describe('The unique identifier for the student.'),
  expirationDays: z
    .number()
    .default(1)
    .describe('The number of days until the link expires.'),
});
export type VerificationLinkInput = z.infer<typeof VerificationLinkInputSchema>;

const VerificationLinkOutputSchema = z.object({
  verificationLink: z.string().describe('The cryptographically signed link.'),
});
export type VerificationLinkOutput = z.infer<typeof VerificationLinkOutputSchema>;

export async function generateVerificationLink(
  input: VerificationLinkInput
): Promise<VerificationLinkOutput> {
  return verificationLinkFlow(input);
}

const verificationLinkPrompt = ai.definePrompt({
  name: 'verificationLinkPrompt',
  input: {schema: VerificationLinkInputSchema},
  output: {schema: VerificationLinkOutputSchema},
  prompt: `You are a verification link generator.

  Generate a cryptographically signed link that can be used to verify the academic records of a student with the ID: {{{studentId}}}.
  The link should expire in {{{expirationDays}}} day(s).

  The link should be a complete URL, including the protocol (https) and domain (example.com), and should include a query parameter called 'token' that contains the cryptographically signed token.
  `,
});

const verificationLinkFlow = ai.defineFlow(
  {
    name: 'verificationLinkFlow',
    inputSchema: VerificationLinkInputSchema,
    outputSchema: VerificationLinkOutputSchema,
  },
  async input => {
    const {output} = await verificationLinkPrompt(input);
    return output!;
  }
);
