interface CreatorStatsProps {
    subscriberCount: number;
    contentCount: number;
    totalViews: number;
    joinDate: string;
  }
  
  export default function CreatorStats({ subscriberCount, contentCount, totalViews, joinDate }: CreatorStatsProps) {
    // Format numbers with commas
    const formatNumber = (num: number): string => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    // Format join date to readable format
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      // Format as "Month Year" (e.g., "January 2023")
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };
    
    const stats = [
      {
        name: 'Subscribers',
        value: formatNumber(subscriberCount),
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )
      },
      {
        name: 'Content',
        value: formatNumber(contentCount),
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      },
      {
        name: 'Views',
        value: formatNumber(totalViews),
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )
      },
      {
        name: 'Joined',
        value: formatDate(joinDate),
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      }
    ];
  
    return (
      <div className="bg-white rounded-lg shadow px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Creator Stats</h3>
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="px-4 py-5 bg-gray-50 rounded-lg overflow-hidden sm:p-6">
              <dt className="flex items-center text-sm font-medium text-gray-500 truncate">
                {stat.icon}
                <span className="ml-2">{stat.name}</span>
              </dt>
              <dd className="mt-1 text-xl font-semibold text-gray-900">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }