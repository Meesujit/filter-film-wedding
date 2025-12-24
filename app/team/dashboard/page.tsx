// app/team/page.tsx
"use client"
import Link from 'next/link';
import { Calendar, Package, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/app/lib/firebase/auth-context';

const mockTeamData = {
  assignedBookings: 8,
  completedTasks: 25,
  pendingReviews: 4,
  teamRating: 4.8,
  assignments: [
    {
      id: 1,
      eventName: "Sarah & John's Wedding",
      date: "2024-06-15",
      role: "Lead Photographer",
      status: "in-progress",
      priority: "high"
    },
    {
      id: 2,
      eventName: "Emma & Michael's Wedding",
      date: "2024-07-20",
      role: "Videographer",
      status: "scheduled",
      priority: "medium"
    },
    {
      id: 3,
      eventName: "Lisa & David's Wedding",
      date: "2024-08-10",
      role: "Assistant Photographer",
      status: "scheduled",
      priority: "low"
    }
  ]
};

export default function TeamDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Assigned Bookings',
      value: mockTeamData.assignedBookings,
      icon: Calendar,
      color: 'bg-blue-500',
      link: '/team/bookings',
    },
    {
      label: 'Completed Tasks',
      value: mockTeamData.completedTasks,
      icon: CheckCircle,
      color: 'bg-green-500',
      link: '/team/bookings',
    },
    {
      label: 'Pending Reviews',
      value: mockTeamData.pendingReviews,
      icon: FileText,
      color: 'bg-orange-500',
      link: '/team/reports',
    },
    {
      label: 'Team Rating',
      value: mockTeamData.teamRating,
      icon: Package,
      color: 'bg-purple-500',
      link: '/team/profile',
    },
  ];

  const quickActions = [
    {
      title: 'View Assignments',
      description: 'Check your upcoming events',
      icon: '📋',
      link: '/team/bookings',
    },
    {
      title: 'Upload Deliverables',
      description: 'Submit your completed work',
      icon: '📤',
      link: '/team/deliverables',
    },
    {
      title: 'Submit Report',
      description: 'Complete event reports',
      icon: '📊',
      link: '/team/reports',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Team Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}! Here are your assignments.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.link}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.link}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{action.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* My Assignments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">My Assignments</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {mockTeamData.assignments.map((assignment) => (
            <div key={assignment.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{assignment.eventName}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      assignment.priority === 'high' ? 'bg-red-100 text-red-700' :
                      assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {assignment.priority}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{assignment.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Package className="w-4 h-4" />
                      <span>{assignment.role}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    assignment.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {assignment.status === 'in-progress' ? (
                      <Clock className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    {assignment.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}