import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';
import { messageService, useMessageService } from '@/services/messageService';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import ConversationItem from '@/components/messages/ConversationItem';
import Input from '@/components/ui/Input';

export default function MessagesPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useContext(UserContext);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // שימוש בשירות המסרים בזמן אמת
  const { isConnected, newMessages } = useMessageService();
  
  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const response = await messageService.getConversations();
        
        if (response.success) {
          setConversations(response.data);
        } else {
          setError(response.message || 'Failed to load conversations');
        }
      } catch (err) {
        setError('An error occurred while fetching conversations');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchConversations();
      
      // הגדרת פולינג רק אם אין חיבור בזמן אמת
      let intervalId: any;
      if (!isConnected) {
        intervalId = setInterval(fetchConversations, 30000); // כל 30 שניות
      }
      
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [isAuthenticated, loading, router, isConnected]);
  
  // עדכון השיחות כאשר מתקבלות הודעות חדשות
  useEffect(() => {
    if (newMessages.length > 0) {
      // עדכון רשימת השיחות
      messageService.getConversations()
        .then(response => {
          if (response.success) {
            setConversations(response.data);
          }
        })
        .catch(err => {
          console.error('Error updating conversations after new message:', err);
        });
    }
  }, [newMessages]);
  
  // Filter conversations based on search term
  const filteredConversations = searchTerm.trim() === ''
    ? conversations
    : conversations.filter(conv => {
        const otherUser = conv.otherUser;
        const fullName = otherUser.fullName || '';
        const username = otherUser.username || '';
        
        const searchLower = searchTerm.toLowerCase();
        return fullName.toLowerCase().includes(searchLower) || 
               username.toLowerCase().includes(searchLower);
      });
  
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading messages...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <div className="flex space-x-2">
          <Link href="/messages/new">
            <Button>New Message</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar - conversation list */}
        <div className="md:col-span-1 bg-white shadow rounded-lg overflow-hidden">
          <div className="p-3 border-b">
            <Input
              id="search"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="overflow-y-auto max-h-[60vh]">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm.trim() !== '' ? 'No matches found' : 'No conversations yet'}
              </div>
            ) : (
              <div className="divide-y">
                {filteredConversations.map((conversation) => (
                  <ConversationItem 
                    key={conversation.otherUser.id} 
                    conversation={conversation} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right side - select or start a conversation */}
        <div className="md:col-span-2 bg-white shadow rounded-lg overflow-hidden flex items-center justify-center p-8">
          <div className="text-center">
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h2 className="text-xl font-medium text-gray-700 mb-2">Your Messages</h2>
            <p className="text-gray-500 mb-4">
              Select a conversation or start a new one
            </p>
            <Link href="/messages/new">
              <Button>Start New Conversation</Button>
            </Link>
            
            {/* סטטוס חיבור */}
            {isConnected && (
              <div className="mt-4 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Live Connection Active
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}