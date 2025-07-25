'use client';

import { useState } from 'react';
import type { CompletedCertificateDetails } from '@/ai/flows/complete-certificate-details';
import { verifyCertificateAction } from './actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Search, BookOpen, Calendar, CheckCircle, Loader2, User } from 'lucide-react';

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
        <span className="font-medium text-muted-foreground">{label}</span>
      </div>
      <span className="text-right font-semibold text-foreground">{value}</span>
    </div>
  );
}

export default function CertCheckPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [certificate, setCertificate] = useState<CompletedCertificateDetails | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const certificateNumber = formData.get('certificateNumber') as string;

    if (!certificateNumber.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please enter a certificate number.',
      });
      return;
    }

    setIsLoading(true);
    setCertificate(null);

    const result = await verifyCertificateAction(certificateNumber);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: result.error,
      });
    } else if (result.data) {
      setCertificate(result.data);
    }

    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-body">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground">CertCheck</h1>
          <p className="mt-2 text-muted-foreground">Certificate Verification Portal</p>
        </div>

        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight">Certificate Verification</CardTitle>
            <CardDescription>Enter the certificate number to check its validity.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certificateNumber">Certificate Number</Label>
                <Input
                  id="certificateNumber"
                  name="certificateNumber"
                  placeholder="e.g., CERT001"
                  required
                  disabled={isLoading}
                  className="text-base"
                />
              </div>
              <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="rounded-xl shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="mt-2 h-4 w-1/2 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              {[150, 200, 120, 80].map(width => (
                <div key={width} className="flex items-center space-x-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className={`h-4 w-[${width}px] rounded-md`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {certificate && !isLoading && (
          <Card className="rounded-xl border-2 border-accent shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl" style={{ color: 'hsl(var(--accent))' }}>
                <CheckCircle className="h-6 w-6" />
                Certificate Verified
              </CardTitle>
              <CardDescription>The following certificate details have been confirmed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
              <DetailRow icon={User} label="Name" value={certificate.name} />
              <DetailRow icon={BookOpen} label="Course Name" value={certificate.courseName} />
              <DetailRow icon={Calendar} label="Date" value={certificate.date} />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
