import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, Edit2, Trash2, ArrowLeft, Save, X, MessageSquare } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

function AdminServicesContent() {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'inquiries'>('services');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    tagline: '',
    imageUrl: '',
    deliverablesText: '',
    benefitsText: '',
    icon: 'Plane',
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (activeTab === 'inquiries') {
      fetchInquiries();
    }
  }, [activeTab]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('skyriting_auth_token');
    if (!token) {
      navigate('/3636847rgyuvfu3f/98184t763gvf/login');
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fetchServices = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/services`, { headers });
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      setInquiriesLoading(true);
      const response = await fetch(`${API_URL}/admin/service-inquiries`, { headers });
      if (!response.ok) throw new Error('Failed to fetch service inquiries');
      const data = await response.json();
      setInquiries(data.inquiries || []);
    } catch (error) {
      console.error('Error fetching service inquiries:', error);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = getAuthHeaders();
    if (!headers) return;
    const deliverables = formData.deliverablesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const benefits = formData.benefitsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((line) => ({ title: line, description: '' }));
    const payload = {
      title: formData.title,
      slug: formData.slug,
      subtitle: formData.subtitle || undefined,
      description: formData.description,
      tagline: formData.tagline || undefined,
      imageUrl: formData.imageUrl || undefined,
      deliverables,
      benefits,
      icon: formData.icon,
      order: formData.order,
      isActive: formData.isActive,
    };
    try {
      const url = editingService
        ? `${API_URL}/admin/services/${editingService._id}`
        : `${API_URL}/admin/services`;
      const method = editingService ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save service');
      }
      setShowForm(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    } catch (error: any) {
      console.error('Error saving service:', error);
      alert(error.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      const response = await fetch(`${API_URL}/admin/services/${id}`, { method: 'DELETE', headers });
      if (!response.ok) throw new Error('Failed to delete service');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    const deliverables = Array.isArray(service.deliverables) ? service.deliverables : [];
    const benefits = Array.isArray(service.benefits) ? service.benefits : [];
    const benefitsText = benefits
      .map((b: string | { title?: string; description?: string }) =>
        typeof b === 'string' ? b : (b.title || '') + (b.description ? ` | ${b.description}` : '')
      )
      .join('\n');
    setFormData({
      title: service.title || '',
      slug: service.slug || '',
      subtitle: service.subtitle || '',
      description: service.description || '',
      tagline: service.tagline || '',
      imageUrl: service.imageUrl || '',
      deliverablesText: deliverables.join('\n'),
      benefitsText,
      icon: service.icon || 'Plane',
      isActive: service.isActive !== false,
      order: service.order ?? 0,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      subtitle: '',
      description: '',
      tagline: '',
      imageUrl: '',
      deliverablesText: '',
      benefitsText: '',
      icon: 'Plane',
      isActive: true,
      order: 0,
    });
    setEditingService(null);
  };

  if (loading && activeTab === 'services' && !showForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-44">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/3636847rgyuvfu3f/98184t763gvf/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Manage Services</h1>
            </div>
            {activeTab === 'services' && (
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                <span>Add Service</span>
              </button>
            )}
          </div>
          <div className="flex gap-2 mt-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 font-medium rounded-t-lg transition ${
                activeTab === 'services'
                  ? 'bg-white border border-b-0 border-gray-200 text-red-600 -mb-px'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Services ({services.length})
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2 font-medium rounded-t-lg transition flex items-center gap-2 ${
                activeTab === 'inquiries'
                  ? 'bg-white border border-b-0 border-gray-200 text-red-600 -mb-px'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Service Inquiries ({inquiries.length})
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'inquiries' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Service contact form submissions</h2>
              <p className="text-sm text-gray-500 mt-1">Users who submitted the form on a service page</p>
            </div>
            {inquiriesLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading inquiries...</p>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No service inquiries yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inquiries.map((inq) => (
                      <tr key={inq._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{inq.name || '-'}</td>
                        <td className="px-4 py-3 text-sm">
                          <a href={`mailto:${inq.email}`} className="text-red-600 hover:underline">
                            {inq.email || '-'}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{inq.phone || '-'}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="font-medium text-gray-900">{inq.serviceName || '-'}</span>
                          {inq.serviceSlug && (
                            <span className="block text-xs text-gray-500">/{inq.serviceSlug}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate" title={inq.message}>
                          {inq.message || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              inq.status === 'new'
                                ? 'bg-blue-100 text-blue-800'
                                : inq.status === 'contacted'
                                ? 'bg-yellow-100 text-yellow-800'
                                : inq.status === 'converted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {inq.status || 'new'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : showForm ? (
          <div className="bg-white rounded-lg shadow p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingService ? 'Edit Service' : 'Create Service'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                        slug: formData.slug || e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Our services"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Short headline under the title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deliverables (one per line)</label>
                <textarea
                  value={formData.deliverablesText}
                  onChange={(e) => setFormData({ ...formData, deliverablesText: e.target.value })}
                  rows={4}
                  placeholder="One item per line"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (one per line)</label>
                <textarea
                  value={formData.benefitsText}
                  onChange={(e) => setFormData({ ...formData, benefitsText: e.target.value })}
                  rows={3}
                  placeholder="One per line"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, imageUrl: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt="Preview" className="mt-2 h-32 w-auto rounded object-cover" />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>{editingService ? 'Update' : 'Create'} Service</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Services ({services.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {services.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="mb-4">No services found</p>
                  <button
                    onClick={() => {
                      resetForm();
                      setShowForm(true);
                    }}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-lg"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Your First Service</span>
                  </button>
                </div>
              ) : (
                services.map((service) => (
                  <div key={service._id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {service.subtitle || (service.description?.slice(0, 120) ?? '')}
                          {(service.description?.length ?? 0) > 120 ? '...' : ''}
                        </p>
                        <a
                          href={`/services/${service.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-red-600 hover:underline mt-1 inline-block"
                        >
                          View on site →
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(service)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminServices() {
  return (
    <ProtectedRoute admin={true}>
      <AdminServicesContent />
    </ProtectedRoute>
  );
}
