import ForgotPasswordForm from '@/app/src/components/auth/forgot-password-form';


export default async function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-card py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}

