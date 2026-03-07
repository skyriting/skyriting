import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, ArrowLeft } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';

function AdminCareerContent() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<any>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const token = localStorage.getItem('skyriting_auth_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

    try {
      const response = await fetch(`${API_URL}/career`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const token = localStorage.getItem('skyriting_auth_token');
    if (!token) return;

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

    try {
      const response = await fetch(`${API_URL}/career/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      fetchApplications();
      if (selectedApp?._id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const filteredApps = applications.filter(app => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        app.name?.toLowerCase().includes(search) ||
        app.email?.toLowerCase().includes(search) ||
        app.position?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading careers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-44">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/3636847rgyuvfu3f/98184t763gvf/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Manage Careers</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Applications ({filteredApps.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {filteredApps.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No applications found</p>
                  </div>
                ) : (
                  filteredApps.map((app) => (
                    <div
                      key={app._id}
                      onClick={() => setSelectedApp(app)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                        selectedApp?._id === app._id ? 'bg-red-50 border-l-4 border-red-600' : ''
                      }`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{app.name}</h3>
                          <p className="text-sm text-gray-600">{app.position}</p>
                          <p className="text-sm text-gray-500">{app.email}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            app.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            app.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                            app.status === 'interviewing' ? 'bg-purple-100 text-purple-800' :
                            app.status === 'hired' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {app.status || 'new'}
                          </span>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedApp ? (
              <div className="bg-white rounded-lg shadow sticky top-4">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Application Details</h2>
                </div>
                <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Applicant</h3>
                    <div className="space-y-1 text-sm bg-gray-50 rounded p-3">
                      <p><span className="font-medium">Name:</span> {selectedApp.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedApp.email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedApp.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Role Info</h3>
                    <div className="space-y-1 text-sm bg-gray-50 rounded p-3">
                      <p><span className="font-medium">Position:</span> {selectedApp.position}</p>
                      <p><span className="font-medium">Experience:</span> {selectedApp.experience}</p>
                      {selectedApp.resume && (
                        <p><span className="font-medium">Resume:</span> <a href={selectedApp.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Link</a></p>
                      )}
                    </div>
                  </div>

                  {selectedApp.coverLetter && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Cover Letter</h3>
                      <div className="text-sm bg-gray-50 rounded p-3 whitespace-pre-wrap">
                        {selectedApp.coverLetter}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
                    <select
                      value={selectedApp.status || 'new'}
                      onChange={(e) => updateStatus(selectedApp._id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Select an application to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminCareer() {
  return (
    <ProtectedRoute admin={true}>
      <AdminCareerContent />
    </ProtectedRoute>
  );
}
