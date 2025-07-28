'use server';

export interface CertificateDetails {
  name: string;
  courseName: string;
  date: string;
}

export interface ActionResponse {
  data?: CertificateDetails;
  error?: string;
}

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzK1Z4g98ZlqXvkVDqzcMc-aW9tRgmSgxfSxfe2hYS-_ABWcUBLVvCtZraYBmiy56xgbg/exec';

export async function verifyCertificateAction(certificateNumber: string): Promise<ActionResponse> {
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?cert=${certificateNumber}`);
    if (!response.ok) {
      throw new Error(`Google Sheet request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      return {error: 'Certificate with this number was not found.'};
    }

    // The key from Google Sheets might have spaces, like "Course Name"
    const courseName = data.courseName || data['Course Name'];

    if (!data.name && !courseName && !data.date) {
      return {error: 'Certificate with this number was not found.'};
    }

    // Format date from ISO string to a simpler format like "May 14, 2024"
    if (data.date) {
      try {
        data.date = new Date(data.date).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } catch (e) {
        console.error('Could not parse date', e);
        // keep original date string if parsing fails
      }
    }

    const certificateData: CertificateDetails = {
      name: data.name,
      courseName: courseName,
      date: data.date,
    };

    return {data: certificateData};
  } catch (e: any) {
    console.error('Verification failed:', e);
    if (e.message.includes('Google Sheet request failed')) {
      return {error: 'Could not connect to the certificate database. Please try again later.'};
    }
    return {error: 'An unexpected error occurred during verification.'};
  }
}
