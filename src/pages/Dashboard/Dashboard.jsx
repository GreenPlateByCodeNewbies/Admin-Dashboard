import { useAuth } from '../../context/AuthContext';
import DashboardLayout from './DashboardLayout';

const Dashboard = () => {
  const { currentUser } = useAuth();

  const stats = [
    {
      title: 'Total Stalls',
      value: '12',
      change: '+2 this month',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      accent: 'bg-emerald-500'
    },
    {
      title: 'Active Bookings',
      value: '48',
      change: '12 pending',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      accent: 'bg-blue-500'
    },
    {
      title: 'Total Students',
      value: '1,234',
      change: '+15% growth',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      accent: 'bg-purple-500'
    },
    {
      title: 'Food Saved',
      value: '245 kg',
      change: 'Eco-impact high',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      accent: 'bg-orange-500'
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Welcome Header */}
        <header className="relative overflow-hidden bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{currentUser?.email?.split('@')[0]}</span>! 👋
            </h1>
            <p className="mt-2 text-lg text-gray-500 font-medium">
              Your campus food system is performing <span className="text-emerald-600">optimally</span> today.
            </p>
          </div>
          {/* Subtle Background Decoration */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-2xl transition-transform group-hover:scale-110`}>
                    {stat.icon}
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.title}</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">{stat.change}</p>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                   <div className={`${stat.accent} h-full w-2/3 transition-all duration-1000 delay-300`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions - Takes up 1 column */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
               Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <button className="group flex items-center p-4 bg-white border border-gray-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-sm">
                <div className="bg-emerald-100 p-3 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                   <svg className="w-6 h-6 text-emerald-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                <span className="ml-4 font-bold text-gray-700">Add New Stall</span>
              </button>

              <button className="group flex items-center p-4 bg-white border border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all shadow-sm">
                <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                   <svg className="w-6 h-6 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <span className="ml-4 font-bold text-gray-700">View Reports</span>
              </button>

              <button className="group flex items-center p-4 bg-white border border-gray-200 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all shadow-sm">
                <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors">
                   <svg className="w-6 h-6 text-purple-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <span className="ml-4 font-bold text-gray-700">Settings</span>
              </button>
            </div>
          </div>

          {/* Recent Activity - Takes up 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
              <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">View All</button>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {[
                    { text: 'New stall "South Canteen" added', time: '2 hours ago', color: 'bg-emerald-500' },
                    { text: 'Domain "@tint.edu.in" verified', time: '5 hours ago', color: 'bg-blue-500' },
                    { text: 'System settings updated', time: '1 day ago', color: 'bg-purple-500' },
                  ].map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <div className="relative pb-8">
                        {itemIdx !== 2 ? (
                          <span className="absolute top-4 left-2.5 -ml-px h-full w-0.5 bg-gray-100" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-5 w-5 rounded-full ${item.color} flex items-center justify-center ring-8 ring-white`}>
                              <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-700">{item.text}</p>
                            </div>
                            <div className="whitespace-nowrap text-right text-xs font-medium text-gray-400">
                              {item.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;