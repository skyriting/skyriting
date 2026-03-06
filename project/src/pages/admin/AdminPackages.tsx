import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Edit2, Trash2, ArrowLeft, Save, X, MessageSquare } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

type Tab = 'packages' | 'inquiries';

type PackageDurationOption = {
  name: string;
  duration?: string;
  days?: number;
  nights?: number;
  price?: number;
  currency?: string;
  maxPax?: number;
  description?: string;
};

type PackageItineraryDay = {
  day: number;
  title: string;
  description: string;
  activities?: string[];
  accommodation?: string;
  meals?: string;
};

type PackageDoc = {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  tagline?: string;
  description: string;
  imageUrl?: string;
  order?: number;
  isActive?: boolean;
  currency?: string;
  priceNote?: string;
  dateFlexibility?: string;
  personCapacity?: string;
  packageIncludes?: string[];
  tourHighlights?: Array<{ icon?: string; text: string }>;
  packageTypes?: string[];
  durationOptions?: PackageDurationOption[];
  itinerary?: PackageItineraryDay[];
};

type PackageInquiryDoc = {
  _id: string;
  createdAt?: string;
  name: string;
  email: string;
  phone: string;
  packageName: string;
  packageSlug: string;
  selectedPackage?: string;
  selectedPackageType?: string;
  selectedDate?: string;
  message?: string;
  status?: 'new' | 'contacted' | 'quoted' | 'converted' | 'archived';
};

function AdminPackagesContent() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PackageDoc[]>([]);
  const [inquiries, setInquiries] = useState<PackageInquiryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('packages');
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageDoc | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    tagline: '',
    description: '',
    imageUrl: '',
    currency: 'INR',
    priceNote: '',
    dateFlexibility: 'Flexible',
    personCapacity: '',
    packageIncludesText: '',
    tourHighlightsText: '',
    packageTypesText: '',
    durationOptionsText: '',
    itineraryText: '',
    isActive: true,
    order: 0,
  });

  const getAuthHeaders = useCallback((): { Authorization: string } | null => {
    const token = localStorage.getItem('skyriting_auth_token');
    if (!token) {
      navigate('/3636847rgyuvfu3f/98184t763gvf/login');
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  }, [navigate]);

  const fetchPackages = useCallback(async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/packages`, { headers });
      if (!response.ok) throw new Error('Failed to fetch packages');
      const data: { packages?: PackageDoc[] } = await response.json();
      setPackages(data.packages || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const fetchInquiries = useCallback(async () => {
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      setInquiriesLoading(true);
      const response = await fetch(`${API_URL}/admin/package-inquiries`, { headers });
      if (!response.ok) throw new Error('Failed to fetch package inquiries');
      const data: { inquiries?: PackageInquiryDoc[] } = await response.json();
      setInquiries(data.inquiries || []);
    } catch (error) {
      console.error('Error fetching package inquiries:', error);
    } finally {
      setInquiriesLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  useEffect(() => {
    if (activeTab === 'inquiries') fetchInquiries();
  }, [activeTab, fetchInquiries]);

  const parseLines = (text: string) =>
    text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

  const parseDurationOptions = useCallback((text: string): PackageDurationOption[] => {
    // Format per line:
    // name | duration | days | nights | price | currency | maxPax | description
    return parseLines(text).map((line) => {
      const parts = line.split('|').map((p) => p.trim());
      const [name, duration, days, nights, price, currency, maxPax, description] = parts;
      return {
        name,
        duration: duration || undefined,
        days: days ? Number(days) : undefined,
        nights: nights ? Number(nights) : undefined,
        price: price ? Number(price) : undefined,
        currency: currency || undefined,
        maxPax: maxPax ? Number(maxPax) : undefined,
        description: description || undefined,
      };
    });
  }, []);

  const parseItinerary = useCallback((text: string): PackageItineraryDay[] => {
    // Each day block separated by blank line.
    // First line: "Day N : Title" or "Day N: Title"
    const blocks = text
      .split(/\n\s*\n/g)
      .map((b) => b.trim())
      .filter(Boolean);

    const days: PackageItineraryDay[] = [];
    for (const block of blocks) {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) continue;
      const header = lines[0];
      const match = header.match(/^Day\s*(\d+)\s*[:-]\s*(.+)$/i) || header.match(/^Day\s*(\d+)\s*:\s*(.+)$/i);
      const dayNum = match ? Number(match[1]) : days.length + 1;
      const title = match ? `Day ${match[1]}: ${match[2]}` : header;
      const description = lines.slice(1).join('\n');
      if (!description) continue;
      days.push({ day: dayNum, title, description });
    }
    return days;
  }, []);

  const payload = useMemo(() => {
    return {
      title: formData.title,
      slug: formData.slug,
      subtitle: formData.subtitle || undefined,
      tagline: formData.tagline || undefined,
      description: formData.description,
      imageUrl: formData.imageUrl || undefined,
      currency: formData.currency || 'INR',
      priceNote: formData.priceNote || undefined,
      dateFlexibility: formData.dateFlexibility || undefined,
      personCapacity: formData.personCapacity || undefined,
      packageIncludes: parseLines(formData.packageIncludesText),
      tourHighlights: parseLines(formData.tourHighlightsText).map((t) => ({ text: t })),
      packageTypes: parseLines(formData.packageTypesText),
      durationOptions: parseDurationOptions(formData.durationOptionsText),
      itinerary: parseItinerary(formData.itineraryText),
      isActive: formData.isActive,
      order: formData.order,
    };
  }, [formData, parseDurationOptions, parseItinerary]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const url = editingPackage ? `${API_URL}/admin/packages/${editingPackage._id}` : `${API_URL}/admin/packages`;
      const method = editingPackage ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData: { error?: string } = await response.json();
        throw new Error(errorData.error || 'Failed to save package');
      }

      setShowForm(false);
      setEditingPackage(null);
      resetForm();
      fetchPackages();
    } catch (error: unknown) {
      console.error('Error saving package:', error);
      alert(error instanceof Error ? error.message : 'Failed to save package');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await fetch(`${API_URL}/admin/packages/${id}`, { method: 'DELETE', headers });
      if (!response.ok) throw new Error('Failed to delete package');
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Failed to delete package');
    }
  };

  const handleEdit = (pkg: PackageDoc) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title || '',
      slug: pkg.slug || '',
      subtitle: pkg.subtitle || '',
      tagline: pkg.tagline || '',
      description: pkg.description || '',
      imageUrl: pkg.imageUrl || '',
      currency: pkg.currency || 'INR',
      priceNote: pkg.priceNote || '',
      dateFlexibility: pkg.dateFlexibility || 'Flexible',
      personCapacity: pkg.personCapacity || '',
      packageIncludesText: (pkg.packageIncludes || []).join('\n'),
      tourHighlightsText: (pkg.tourHighlights || []).map((h) => h.text).join('\n'),
      packageTypesText: (pkg.packageTypes || []).join('\n'),
      durationOptionsText: (pkg.durationOptions || [])
        .map((o) =>
          [
            o.name,
            o.duration || '',
            o.days ?? '',
            o.nights ?? '',
            o.price ?? '',
            o.currency || '',
            o.maxPax ?? '',
            o.description || '',
          ].join(' | ')
        )
        .join('\n'),
      itineraryText: (pkg.itinerary || [])
        .map((d) => `${d.title}\n${d.description}`.trim())
        .join('\n\n'),
      isActive: pkg.isActive !== false,
      order: pkg.order ?? 0,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      subtitle: '',
      tagline: '',
      description: '',
      imageUrl: '',
      currency: 'INR',
      priceNote: '',
      dateFlexibility: 'Flexible',
      personCapacity: '',
      packageIncludesText: '',
      tourHighlightsText: '',
      packageTypesText: '',
      durationOptionsText: '',
      itineraryText: '',
      isActive: true,
      order: 0,
    });
    setEditingPackage(null);
  };

  if (loading && activeTab === 'packages' && !showForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <h1 className="text-2xl font-bold text-gray-900">Manage Packages</h1>
            </div>
            {activeTab === 'packages' && (
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                <span>Add Package</span>
              </button>
            )}
          </div>

          <div className="flex gap-2 mt-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('packages')}
              className={`px-4 py-2 font-medium rounded-t-lg transition ${
                activeTab === 'packages'
                  ? 'bg-white border border-b-0 border-gray-200 text-red-600 -mb-px'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Packages ({packages.length})
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
              Package Inquiries ({inquiries.length})
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'inquiries' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Package booking form submissions</h2>
              <p className="text-sm text-gray-500 mt-1">Users who submitted the form on a package page</p>
            </div>
            {inquiriesLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading inquiries...</p>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No package inquiries yet</p>
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Selection</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Selected</th>
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
                          <span className="font-medium text-gray-900">{inq.packageName || '-'}</span>
                          {inq.packageSlug ? <span className="block text-xs text-gray-500">/{inq.packageSlug}</span> : null}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {inq.selectedPackage || '-'}
                          {inq.selectedPackageType ? <span className="block text-xs text-gray-500">{inq.selectedPackageType}</span> : null}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{inq.selectedDate || '-'}</td>
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
                {editingPackage ? 'Edit Package' : 'Create Package'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
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
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="mt-2 h-32 w-auto rounded object-cover" />
                ) : null}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Flexibility</label>
                  <input
                    type="text"
                    value={formData.dateFlexibility}
                    onChange={(e) => setFormData({ ...formData, dateFlexibility: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Person Capacity</label>
                  <input
                    type="text"
                    value={formData.personCapacity}
                    onChange={(e) => setFormData({ ...formData, personCapacity: e.target.value })}
                    placeholder="e.g. 6 pax or less"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Includes (one per line)</label>
                <textarea
                  value={formData.packageIncludesText}
                  onChange={(e) => setFormData({ ...formData, packageIncludesText: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Highlights (one per line)</label>
                <textarea
                  value={formData.tourHighlightsText}
                  onChange={(e) => setFormData({ ...formData, tourHighlightsText: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Types (one per line)</label>
                <textarea
                  value={formData.packageTypesText}
                  onChange={(e) => setFormData({ ...formData, packageTypesText: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration Options (one per line)</label>
                <p className="text-xs text-gray-500 mb-2">Format: name | duration | days | nights | price | currency | maxPax | description</p>
                <textarea
                  value={formData.durationOptionsText}
                  onChange={(e) => setFormData({ ...formData, durationOptionsText: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Itinerary</label>
                <p className="text-xs text-gray-500 mb-2">Separate days with a blank line. First line: \"Day N: Title\" then description.</p>
                <textarea
                  value={formData.itineraryText}
                  onChange={(e) => setFormData({ ...formData, itineraryText: e.target.value })}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Note</label>
                <input
                  type="text"
                  value={formData.priceNote}
                  onChange={(e) => setFormData({ ...formData, priceNote: e.target.value })}
                  placeholder="e.g. Starting from ₹ 2,00,000/- Seat"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
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
                  <span>{editingPackage ? 'Update' : 'Create'} Package</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Packages ({packages.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {packages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="mb-4">No packages found</p>
                  <button
                    onClick={() => {
                      resetForm();
                      setShowForm(true);
                    }}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-lg"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Your First Package</span>
                  </button>
                </div>
              ) : (
                packages.map((pkg) => (
                  <div key={pkg._id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{pkg.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {pkg.subtitle || pkg.description?.slice(0, 120)}
                          {pkg.description && pkg.description.length > 120 ? '...' : ''}
                        </p>
                        <a
                          href={`/packages/${pkg.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-red-600 hover:underline mt-1 inline-block"
                        >
                          View on site →
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg._id)}
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

export default function AdminPackages() {
  return (
    <ProtectedRoute admin={true}>
      <AdminPackagesContent />
    </ProtectedRoute>
  );
}
