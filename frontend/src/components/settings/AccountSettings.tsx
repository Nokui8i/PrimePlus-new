import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { userService } from '@/services/userService';
import { TrashIcon } from '@heroicons/react/24/outline';

const AccountSettings = () => {
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setSaveStatus('error');
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    try {
      await userService.updatePassword({
        currentPassword,
        newPassword
      });
      setSaveStatus('success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteAccount();
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Account Info */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Username
            </label>
            <p className="text-neutral-900 dark:text-white">@{user?.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Email
            </label>
            <p className="text-neutral-900 dark:text-white">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Account Created
            </label>
            <p className="text-neutral-900 dark:text-white">
              {new Date(user?.createdAt || '').toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>

      {/* Change Password */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
              required
            />
          </div>
          <div className="flex items-center justify-end space-x-4">
            {saveStatus === 'success' && (
              <span className="text-green-600">Password updated successfully!</span>
            )}
            {saveStatus === 'error' && (
              <span className="text-red-600">Failed to update password</span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 ${
                isSaving ? 'cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? 'Saving...' : 'Update Password'}
            </button>
          </div>
        </form>
      </section>

      {/* Delete Account */}
      <section className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
        <div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <TrashIcon className="w-5 h-5 mr-2" />
            Delete Account
          </button>
        </div>
      </section>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Delete Account</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings; 