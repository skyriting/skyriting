import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Filter, ArrowLeft, CheckCircle, XCircle, Clock, MessageSquare, Edit2, Save, X } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';

function AdminInquiriesContent() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const fetchInquiries = async () => {
    const token = localStorage.getItem('skyriting_admin_token');
    if (!token) {
      navigate('/3636847rgyuvfu3f/98184t763gvf/login');
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`${API_URL}/admin/inquiries?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch inquiries');
      }

      const data = await response.json();
      setInquiries(data.inquiries || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id: string, newStatus: string) => {
    const token = localStorage.getItem('skyriting_admin_token');
    if (!token) return;

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

    try {
      const response = await fetch(`${API_URL}/admin/inquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update inquiry');
      }

      fetchInquiries();
      if (selectedInquiry?._id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
      alert('Failed to update inquiry status');
    }
  };

  const saveNotes = async () => {
    if (!selectedInquiry) return;

    const token = localStorage.getItem('skyriting_admin_token');
    if (!token) return;

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

    try {
      const response = await fetch(`${API_URL}/admin/inquiries/${selectedInquiry._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes, adminNotes }),
      });

      if (!response.ok) {
        throw new Error('Failed to save notes');
      }

      setEditingNotes(false);
      fetchInquiries();
      setSelectedInquiry({ ...selectedInquiry, notes, adminNotes });
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'sourcing': return 'bg-yellow-100 text-yellow-800';
      case 'quoted': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="h-4 w-4" />;
      case 'sourcing': return <Search className="h-4 w-4" />;
      case 'quoted': return <FileText className="h-4 w-4" />;
      case 'converted': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        inquiry.customer_name?.toLowerCase().includes(search) ||
        inquiry.customer_email?.toLowerCase().includes(search) ||
        inquiry.customer_phone?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/3636847rgyuvfu3f/98184t763gvf/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Manage Inquiries</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="sourcing">Sourcing</option>
                <option value="quoted">Quoted</option>
                <option value="converted">Converted</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inquiries List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Inquiries ({filteredInquiries.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {filteredInquiries.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No inquiries found</p>
                  </div>
                ) : (
                  filteredInquiries.map((inquiry) => (
                    <div
                      key={inquiry._id}
                      onClick={() => {
                        setSelectedInquiry(inquiry);
                        setNotes(inquiry.notes || '');
                        setAdminNotes(inquiry.adminNotes || '');
                        setEditingNotes(false);
                      }}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                        selectedInquiry?._id === inquiry._id ? 'bg-red-50 border-l-4 border-red-600' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{inquiry.customer_name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(inquiry.status)}`}>
                              {getStatusIcon(inquiry.status)}
                              <span className="capitalize">{inquiry.status}</span>
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{inquiry.customer_email}</p>
                          <p className="text-sm text-gray-600">{inquiry.customer_phone}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {inquiry.trip_type === 'multi-trip' 
                              ? `${inquiry.legs?.length || 0} legs`
                              : `${inquiry.departure_city} → ${inquiry.arrival_city}`
                            }
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Inquiry Details */}
          <div className="lg:col-span-1">
            {selectedInquiry ? (
              <div className="bg-white rounded-lg shadow sticky top-4">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Inquiry Details</h2>
                </div>
                <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                  {/* Customer Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedInquiry.customer_name}</p>
                      <p><span className="font-medium">Email:</span> {selectedInquiry.customer_email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedInquiry.customer_phone}</p>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Trip Details</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Type:</span> <span className="capitalize">{selectedInquiry.trip_type}</span></p>
                      <p><span className="font-medium">Aircraft:</span> {selectedInquiry.aircraft_type}</p>
                      <p><span className="font-medium">Passengers:</span> {selectedInquiry.passenger_count}</p>
                      {selectedInquiry.trip_type === 'multi-trip' && selectedInquiry.legs ? (
                        <div className="mt-2">
                          <p className="font-medium mb-1">Legs:</p>
                          {selectedInquiry.legs.map((leg: any, idx: number) => (
                            <div key={idx} className="text-xs bg-gray-50 p-2 rounded mb-1">
                              <p>{leg.origin} → {leg.destination}</p>
                              <p className="text-gray-500">{new Date(leg.departureDate).toLocaleDateString()} {leg.departureTime}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <p><span className="font-medium">Route:</span> {selectedInquiry.departure_city} → {selectedInquiry.arrival_city}</p>
                          <p><span className="font-medium">Departure:</span> {selectedInquiry.departure_date ? new Date(selectedInquiry.departure_date).toLocaleDateString() : 'N/A'} {selectedInquiry.departure_time}</p>
                          {selectedInquiry.return_date && (
                            <p><span className="font-medium">Return:</span> {new Date(selectedInquiry.return_date).toLocaleDateString()} {selectedInquiry.return_time}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => updateInquiryStatus(selectedInquiry._id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="new">New</option>
                      <option value="sourcing">Sourcing</option>
                      <option value="quoted">Quoted</option>
                      <option value="converted">Converted</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>Notes</span>
                      </h3>
                      {!editingNotes ? (
                        <button
                          onClick={() => setEditingNotes(true)}
                          className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={saveNotes}
                            className="text-sm text-green-600 hover:text-green-700 flex items-center space-x-1"
                          >
                            <Save className="h-4 w-4" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingNotes(false);
                              setNotes(selectedInquiry.notes || '');
                              setAdminNotes(selectedInquiry.adminNotes || '');
                            }}
                            className="text-sm text-gray-600 hover:text-gray-700 flex items-center space-x-1"
                          >
                            <X className="h-4 w-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      )}
                    </div>
                    {editingNotes ? (
                      <div className="space-y-2">
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Customer notes..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
                          rows={3}
                        />
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Admin notes (internal)..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
                          rows={3}
                        />
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        {notes && (
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="font-medium text-gray-700 mb-1">Customer Notes:</p>
                            <p className="text-gray-600">{notes || 'No notes'}</p>
                          </div>
                        )}
                        {adminNotes && (
                          <div className="bg-red-50 p-2 rounded">
                            <p className="font-medium text-gray-700 mb-1">Admin Notes:</p>
                            <p className="text-gray-600">{adminNotes || 'No admin notes'}</p>
                          </div>
                        )}
                        {!notes && !adminNotes && (
                          <p className="text-gray-400 italic">No notes</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  {selectedInquiry.message && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Message</h3>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{selectedInquiry.message}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Select an inquiry to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminInquiries() {
  return (
    <ProtectedRoute admin={true}>
      <AdminInquiriesContent />
    </ProtectedRoute>
  );
}
