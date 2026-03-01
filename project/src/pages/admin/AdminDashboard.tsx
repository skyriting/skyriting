import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, FileText, Plane, Settings, LogOut, TrendingUp, Calendar, Package, Briefcase, Newspaper, MessageSquare } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';

function AdminDashboardContent() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalInquiries: 0,
    totalQuotes: 0,
    totalBookings: 0,
    availableAircraft: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('skyriting_admin_token');
    if (!token) {
      navigate('/3636847rgyuvfu3f/98184t763gvf/login');
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

    try {
      const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('skyriting_admin_token');
    navigate('/3636847rgyuvfu3f/98184t763gvf/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Skyriting Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalInquiries}</p>
              </div>
              <FileText className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalQuotes}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookings}</p>
              </div>
              <Plane className="h-12 w-12 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Aircraft</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.availableAircraft}</p>
              </div>
              <BarChart3 className="h-12 w-12 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/3636847rgyuvfu3f/98184t763gvf/fleet')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <Plane className="h-8 w-8 text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Manage Fleet</h3>
            <p className="text-sm text-gray-600">Add and manage aircraft</p>
          </button>

          <button
            onClick={() => navigate('/3636847rgyuvfu3f/98184t763gvf/inquiries')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <FileText className="h-8 w-8 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Manage Inquiries</h3>
            <p className="text-sm text-gray-600">View and manage customer inquiries</p>
          </button>

          <button
            onClick={() => navigate('/3636847rgyuvfu3f/98184t763gvf/bookings')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <Calendar className="h-8 w-8 text-purple-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Manage Bookings</h3>
            <p className="text-sm text-gray-600">View and manage all bookings</p>
          </button>

          <button
            onClick={() => navigate('/3636847rgyuvfu3f/98184t763gvf/pricing')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <Settings className="h-8 w-8 text-orange-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Pricing Rules</h3>
            <p className="text-sm text-gray-600">Configure pricing and margins</p>
          </button>

          <button
            onClick={() => navigate('/3636847rgyuvfu3f/98184t763gvf/routes')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <BarChart3 className="h-8 w-8 text-indigo-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Manage Routes</h3>
            <p className="text-sm text-gray-600">Configure popular routes</p>
          </button>

          <button
            onClick={() => navigate('/3636847rgyuvfu3f/98184t763gvf/packages')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <Package className="h-8 w-8 text-pink-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Manage Packages</h3>
            <p className="text-sm text-gray-600">Manage travel packages</p>
          </button>

          <button
            onClick={() => navigate('/3636847rgyuvfu3f/98184t763gvf/services')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <Briefcase className="h-8 w-8 text-teal-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Manage Services</h3>
            <p className="text-sm text-gray-600">Manage services offered</p>
          </button>

          <button
            onClick={() => navigate('/3636847rgyuvfu3f/98184t763gvf/articles')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <Newspaper className="h-8 w-8 text-cyan-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Manage Articles</h3>
            <p className="text-sm text-gray-600">Manage news and media</p>
          </button>

          <button
            onClick={() => navigate('/3636847rgyuvfu3f/98184t763gvf/mobility')}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <MessageSquare className="h-8 w-8 text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Mobility Thread</h3>
            <p className="text-sm text-gray-600">Manage mobility thread posts</p>
          </button>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute admin={true}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
