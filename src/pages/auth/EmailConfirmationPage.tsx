import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/services/auth/useAuth';
import { useToast } from '@/components/ui/use-toast';

export function EmailConfirmationPage() {
  const {user, getMyUser, verifyEmail, resendVerificationEmail} = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setIsLoading(true);
    
    try {
      await verifyEmail(verificationCode);
      setIsVerified(true);
      toast({
        title: t.common.success,
        description: t.verifyEmail.successVerify,
      });
      
      // Rediriger vers login après 2 secondes
      setTimeout(() => {
        getMyUser();
        // navigate('/login');
      }, 4000);
    } catch (err: any) {
      setError(t.verifyEmail.errorVerify);
      toast({
        title: t.common.error,
        description: t.verifyEmail.errorVerify,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await resendVerificationEmail();
      toast({
        title: t.common.success,
        description: t.verifyEmail.successSend,
      });
    } catch (err: any) {
      setError(t.verifyEmail.errorSend);
      toast({
        title: t.common.error,
        description: t.verifyEmail.errorSend,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-primary" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Mail className="mr-2 h-6 w-6" />
            OrariMed
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <Card>
              <CardHeader className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
                <CardTitle>{t.verifyEmail.verifiedTitle}</CardTitle>
                <CardDescription>
                  {t.verifyEmail.verifiedDescription}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Mail className="mr-2 h-6 w-6" />
          OrariMed
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              {t.verifyEmail.leftTitle}
            </p>
            <footer className="text-sm">{t.verifyEmail.leftDescription}</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Button
            variant="ghost"
            className="w-fit mb-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.common.return}
          </Button>

          <Card>
            <CardHeader className="text-center">
              <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
              <CardTitle>{t.verifyEmail.title}</CardTitle>
              <CardDescription>
                {t.verifyEmail.description}<br />
                <span className="font-medium">{user?.email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder={t.verifyEmail.codePlaceholder}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center tracking-[1rem] !text-xl placeholder:tracking-normal placeholder:text-base"
                    required
                  />
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button type="submit" className="w-full" disabled={isLoading || verificationCode.length !== 6}>
                  {isLoading ? t.verifyEmail.verifyLoading : t.verifyEmail.verifyButton}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {t.verifyEmail.notReceived}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResendCode}
                  disabled={isLoading}
                >
                  {isLoading ? t.verifyEmail.resendLoading : t.verifyEmail.resendButton}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
