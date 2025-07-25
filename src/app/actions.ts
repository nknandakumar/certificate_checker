'use server';

import {
  completeCertificateDetails,
  type CertificateDetails,
  type CompletedCertificateDetails,
} from '@/ai/flows/complete-certificate-details';

// Mock database of certificates
const mockCertificates: { [key: string]: CertificateDetails } = {
  '12345': {
    name: 'Jane Doe',
    course: 'Advanced React',
    // Missing completionDate and grade to demonstrate AI completion
  },
  '67890': {
    name: 'John Smith',
    course: 'Next.js Fundamentals',
    completionDate: '2023-10-26',
    grade: 'A+',
  },
};

export interface ActionResponse {
  data?: CompletedCertificateDetails;
  error?: string;
}

export async function verifyCertificateAction(certificateNumber: string): Promise<ActionResponse> {
  // Simulate network delay to show loading state
  await new Promise(resolve => setTimeout(resolve, 1500));

  const certificateData = mockCertificates[certificateNumber];

  if (!certificateData) {
    return { error: 'Certificate with this number was not found.' };
  }

  try {
    const isComplete =
      certificateData.name && certificateData.course && certificateData.completionDate && certificateData.grade;

    if (isComplete) {
      return { data: certificateData as CompletedCertificateDetails };
    }

    // If details are missing, use AI to complete them
    const completedData = await completeCertificateDetails(certificateData);
    return { data: completedData };
  } catch (e) {
    console.error('AI completion failed:', e);
    return { error: 'An unexpected error occurred during verification.' };
  }
}
