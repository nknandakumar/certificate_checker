'use server';

import {
  completeCertificateDetails,
  type CertificateDetails,
  type CompletedCertificateDetails,
} from '@/ai/flows/complete-certificate-details';

export interface ActionResponse {
  data?: CompletedCertificateDetails;
  error?: string;
}

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzK1Z4g98ZlqXvkVDqzcMc-aW9tRgmSgxfSxfe2hYS-_ABWcUBLVvCtZraYBmiy56xgbg/exec';


export async function verifyCertificateAction(certificateNumber: string): Promise<ActionResponse> {
  // Simulate network delay to show loading state
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?cert=${certificateNumber}`);
    if (!response.ok) {
      throw new Error(`Google Sheet request failed with status ${response.status}`);
    }
    
    const data = await response.json();

    if (data.error) {
      return { error: data.error };
    }
    
    if (!data.name && !data.courseName && !data.date) {
        return { error: 'Certificate with this number was not found.' };
    }
    
    // Format date from ISO string to a simpler format like "May 14, 2024"
    if (data.date) {
      try {
        data.date = new Date(data.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
      } catch (e) {
        console.error("Could not parse date", e);
        // keep original date string if parsing fails
      }
    }


    const certificateData: CertificateDetails = {
      name: data.name,
      courseName: data.courseName,
      date: data.date,
    };
    
    const isComplete =
      certificateData.name && certificateData.courseName && certificateData.date;

    if (isComplete) {
      return { data: certificateData as CompletedCertificateDetails };
    }

    // If details are missing, use AI to complete them
    const completedData = await completeCertificateDetails(certificateData);
    return { data: completedData };
  } catch (e: any) {
    console.error('Verification failed:', e);
    if (e.message.includes('Google Sheet request failed')) {
         return { error: 'Could not connect to the certificate database. Please try again later.' };
    }
    return { error: 'An unexpected error occurred during verification.' };
  }
}
