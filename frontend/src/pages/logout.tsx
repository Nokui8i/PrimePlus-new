import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/providers/AuthProvider';

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
        // Still redirect to login even if logout fails
        router.push('/login');
      }
    };

    handleLogout();
  }, [logout, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Logging out...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
} 