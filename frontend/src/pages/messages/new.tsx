import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';
import { messageService, useMessageService } from '@/services/messageService';
import { userService } from '@/services/api';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import MessageInput from '@/components/messages/MessageInput';
import Image from 'next/image';

interface User {
  id: string;
  username: string;
  fullName?: string;
  profileImage?: string;
}

export default function NewMessagePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useContext(UserContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  
  // שימוש בשירות ההודעות בזמן אמת
  const { sendMessageSocket } = useMessageService();
  
  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, loading, router]);
  
  useEffect(() => {
    // Search users when search term changes
    const searchUsers = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      
      try {
        // For a real implementation, call the user search API
        // const response = await userService.searchUsers(searchTerm);
        
        // Mock data for demonstration
        // In a real app, this would be an API call
        setTimeout(() => {
          const mockUsers = [
            { id: '1', username: 'john_doe', fullName: 'John Doe', profileImage: null },
            { id: '2', username: 'jane_smith', fullName: 'Jane Smith', profileImage: null },
            { id: '3', username: 'alex_wilson', fullName: 'Alex Wilson', profileImage: null },
            { id: '4', username: 'sam_johnson', fullName: 'Sam Johnson', profileImage: null },
            { id: '5', username: 'taylor_brown', fullName: 'Taylor Brown', profileImage: null },
          ];
          
          const filteredUsers = mockUsers.filter(u => 
            u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (u.fullName && u.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
          );
          
          setSearchResults(filteredUsers);
          setIsSearching(false);
        }, 500);
      } catch (err) {
        console.error('Error searching users:', err);
        setError('Failed to search users');
        setIsSearching(false);
      }
    };
    
    if (isAuthenticated) {
      const timerId = setTimeout(searchUsers, 300);
      return () => clearTimeout(timerId);
    }
  }, [searchTerm, isAuthenticated]);
  
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSearchTerm('');
    setSearchResults([]);
  };
  
  const handleSendMessage = async (content: string, attachment?: File) => {
    if (!selectedUser || (!content.trim() && !attachment)) return;
    
    try {
      setIsSending(true);
      
      let response;
      
      // נסה לשלוח הודעה דרך Socket.IO ראשית
      try {
        response = await sendMessageSocket(selectedUser.id, content);
      } catch (socketError) {
        console.warn('Socket send failed, falling back to API', socketError);
        // אם Socket נכשל, מנסה דרך ה-API
        response = await messageService.sendMessage(selectedUser.id, content, attachment);
      }
      
      if (response && response.success) {
        // Navigate to the conversation
        router.push(`/messages/${selectedUser.id}`);
      } else {
        setError((response && response.message) || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('An error occurred while sending the message');
    } finally {
      setIsSending(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/messages">
          <Button variant="outline" size="sm">
            ← Back to Messages
          </Button>
        </Link>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">New Message</h1>
          
          {error && (
            <div className="bg-red-50 p-4 rounded-md mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {!selectedUser ? (
            <div>
              <div className="mb-6">
                <Input
                  id="search"
                  label="Search for a user"
                  placeholder="Enter username or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="mt-4">
                {isSearching ? (
                  <p className="text-gray-500 text-center py-2">Searching...</p>
                ) : searchTerm && searchResults.length === 0 ? (
                  <p className="text-gray-500 text-center py-2">No users found</p>
                ) : (
                  <ul className="divide-y">
                    {searchResults.map((resultUser) => (
                      <li key={resultUser.id}>
                        <button
                          onClick={() => handleUserSelect(resultUser)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center"
                        >
                          <div className="mr-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 relative">
                              {resultUser.profileImage ? (
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_API_URL}${resultUser.profileImage}`}
                                  alt={resultUser.username}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-100">
                                  <span className="text-blue-600 text-sm font-medium">
                                    {resultUser.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {resultUser.fullName || resultUser.username}
                            </p>
                            <p className="text-sm text-gray-500">
                              @{resultUser.username}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-4 pb-4 border-b">
                <div className="mr-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 relative">
                    {selectedUser.profileImage ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${selectedUser.profileImage}`}
                        alt={selectedUser.username}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-100">
                        <span className="text-blue-600 text-sm font-medium">
                          {selectedUser.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-gray-900">
                    {selectedUser.fullName || selectedUser.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    @{selectedUser.username}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                >
                  Change
                </Button>
              </div>
              
              <div className="mb-4">
                <MessageInput 
                  onSendMessage={handleSendMessage} 
                  disabled={isSending}
                  placeholder={`Write your message to ${selectedUser.fullName || selectedUser.username}...`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}