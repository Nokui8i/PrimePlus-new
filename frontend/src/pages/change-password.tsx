import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';
import { userService } from '@/services/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';

export default function ChangePassword() {
  const { isAuthenticated, loading } = useContext(UserContext);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }
    
    try {
      setIsChanging(true);
      setError(null);
      
      const response = await userService.changePassword(
        formData.currentPassword,
        formData.newPassword
      );
      
      if (response.success) {
        setSuccessMessage('Password changed successfully');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Redirect to profile after 2 seconds
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        setError('Failed to change password');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while changing password');
    } finally {
      setIsChanging(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }
  
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Change Password</h1>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 p-4 rounded-md mb-6">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="currentPassword"
                name="currentPassword"
                label="Current Password"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Input
                id="newPassword"
                name="newPassword"
                label="New Password"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <Button
                type="submit"
                disabled={isChanging}
              >
                {isChanging ? 'Changing...' : 'Change Password'}
              </Button>
              
              <Link href="/profile">
                <Button variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}