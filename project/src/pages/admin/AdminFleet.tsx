import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Plus, Edit2, Trash2, ArrowLeft, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';

function AdminFleetContent() {
  const navigate = useNavigate();
  const [aircraft, setAircraft] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAircraft, setEditingAircraft] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    tailNumber: '',
    category: 'Light',
    type: 'Light',
    manufacturer: '',
    model: '',
    hourly_rate: 0,
    currency: 'USD',
    commissionPercentage: 0,
    operatingCosts: {
      hourlyOperatingCost: 0,
      fuelCostPerKm: 0,
      crewExpensePerHour: 0,
    },
    specs: {
      seats: 0,
      passenger_capacity: 0,
      baggage: '',
      baggageCapacity: '',
      base: '',
      pilots: 2,
      speed: 0,
      cruise_speed: 0,
      range_km: 0,
      flightAttendant: false,
      yearOfManufacture: 0,
      cabinHeight: '',
      cabinWidth: '',
      cabinLength: '',
      lavatory: 0,
      flyingRange: '',
    },
    description: '',
    image_url: '',
    images: [] as string[],
    interiorPhotos: [] as string[],
    rangeMapImage: '',
    amenities: [] as string[],
    available: true,
    isActive: true,
  });

  useEffect(() => {
    fetchAircraft();
  }, []);

  const fetchAircraft = async () => {
    const token = localStorage.getItem('skyriting_admin_token');
    if (!token) {
      navigate('/3636847rgyuvfu3f/98184t763gvf/login');
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

    try {
      const response = await fetch(`${API_URL}/admin/aircraft`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch aircraft');
      }

      const data = await response.json();
      setAircraft(data.aircraft || []);
    } catch (error) {
      console.error('Error fetching aircraft:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (field === 'image_url') {
        setFormData({ ...formData, image_url: base64 });
      } else if (field === 'rangeMapImage') {
        setFormData({ ...formData, rangeMapImage: base64 });
      } else if (field.startsWith('interiorPhotos')) {
        setFormData({
          ...formData,
          interiorPhotos: [...formData.interiorPhotos, base64],
        });
      } else if (field.startsWith('images')) {
        setFormData({
          ...formData,
          images: [...formData.images, base64],
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('skyriting_admin_token');
    if (!token) return;

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

    try {
      const url = editingAircraft
        ? `${API_URL}/admin/aircraft/${editingAircraft._id}`
        : `${API_URL}/admin/aircraft`;

      const method = editingAircraft ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save aircraft');
      }

      setShowForm(false);
      setEditingAircraft(null);
      resetForm();
      fetchAircraft();
    } catch (error: any) {
      console.error('Error saving aircraft:', error);
      alert(error.message || 'Failed to save aircraft');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this aircraft?')) return;

    const token = localStorage.getItem('skyriting_admin_token');
    if (!token) return;

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

    try {
      const response = await fetch(`${API_URL}/admin/aircraft/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete aircraft');
      }

      fetchAircraft();
    } catch (error) {
      console.error('Error deleting aircraft:', error);
      alert('Failed to delete aircraft');
    }
  };

  const handleEdit = (aircraftData: any) => {
    setEditingAircraft(aircraftData);
    setFormData({
      name: aircraftData.name || '',
      tailNumber: aircraftData.tailNumber || '',
      category: aircraftData.category || 'Light',
      type: aircraftData.type || 'Light',
      manufacturer: aircraftData.manufacturer || '',
      model: aircraftData.model || '',
      hourly_rate: aircraftData.hourly_rate || 0,
      currency: aircraftData.currency || 'USD',
      commissionPercentage: aircraftData.commissionPercentage || 0,
      operatingCosts: aircraftData.operatingCosts || {
        hourlyOperatingCost: 0,
        fuelCostPerKm: 0,
        crewExpensePerHour: 0,
      },
      specs: aircraftData.specs || {
        seats: 0,
        passenger_capacity: 0,
        baggage: '',
        baggageCapacity: '',
        base: '',
        pilots: 2,
        speed: 0,
        cruise_speed: 0,
        range_km: 0,
        flightAttendant: false,
        yearOfManufacture: 0,
        cabinHeight: '',
        cabinWidth: '',
        cabinLength: '',
        lavatory: 0,
        flyingRange: '',
      },
      description: aircraftData.description || '',
      image_url: aircraftData.image_url || '',
      images: aircraftData.images || [],
      interiorPhotos: aircraftData.interiorPhotos || [],
      rangeMapImage: aircraftData.rangeMapImage || '',
      amenities: aircraftData.amenities || [],
      available: aircraftData.available !== false,
      isActive: aircraftData.isActive !== false,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      tailNumber: '',
      category: 'Light',
      type: 'Light',
      manufacturer: '',
      model: '',
      hourly_rate: 0,
      currency: 'USD',
      commissionPercentage: 0,
      operatingCosts: {
        hourlyOperatingCost: 0,
        fuelCostPerKm: 0,
        crewExpensePerHour: 0,
      },
      specs: {
        seats: 0,
        passenger_capacity: 0,
        baggage: '',
        baggageCapacity: '',
        base: '',
        pilots: 2,
        speed: 0,
        cruise_speed: 0,
        range_km: 0,
        flightAttendant: false,
        yearOfManufacture: 0,
        cabinHeight: '',
        cabinWidth: '',
        cabinLength: '',
        lavatory: 0,
        flyingRange: '',
      },
      description: '',
      image_url: '',
      images: [],
      interiorPhotos: [],
      rangeMapImage: '',
      amenities: [],
      available: true,
      isActive: true,
    });
    setEditingAircraft(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fleet...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Manage Fleet</h1>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Plus className="h-5 w-5" />
              <span>Add Aircraft</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          <div className="bg-white rounded-lg shadow p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingAircraft ? 'Edit Aircraft' : 'Add New Aircraft'}
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
              {/* Basic Information */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aircraft Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tail Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.tailNumber}
                      onChange={(e) => setFormData({ ...formData, tailNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="Light">Light</option>
                      <option value="Mid">Mid</option>
                      <option value="Super Mid">Super Mid</option>
                      <option value="Large">Large</option>
                      <option value="Airliner">Airliner</option>
                      <option value="Helicopter">Helicopter</option>
                      <option value="Turboprop">Turboprop</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer *</label>
                    <input
                      type="text"
                      required
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.hourly_rate}
                      onChange={(e) => setFormData({ ...formData, hourly_rate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commission (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.commissionPercentage}
                      onChange={(e) => setFormData({ ...formData, commissionPercentage: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Commission percentage for this specific aircraft</p>
                  </div>
                </div>
              </div>

              {/* Operating Costs */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Costs</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Operating Cost *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.operatingCosts.hourlyOperatingCost}
                      onChange={(e) => setFormData({
                        ...formData,
                        operatingCosts: { ...formData.operatingCosts, hourlyOperatingCost: parseFloat(e.target.value) || 0 },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Cost (per km)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.operatingCosts.fuelCostPerKm}
                      onChange={(e) => setFormData({
                        ...formData,
                        operatingCosts: { ...formData.operatingCosts, fuelCostPerKm: parseFloat(e.target.value) || 0 },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Crew Expense (per hour)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.operatingCosts.crewExpensePerHour}
                      onChange={(e) => setFormData({
                        ...formData,
                        operatingCosts: { ...formData.operatingCosts, crewExpensePerHour: parseFloat(e.target.value) || 0 },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seats *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.specs.seats}
                      onChange={(e) => setFormData({
                        ...formData,
                        specs: { ...formData.specs, seats: parseInt(e.target.value) || 0, passenger_capacity: parseInt(e.target.value) || 0 },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Speed (KTS) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.specs.speed}
                      onChange={(e) => setFormData({
                        ...formData,
                        specs: { ...formData.specs, speed: parseInt(e.target.value) || 0, cruise_speed: parseInt(e.target.value) || 0 },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Range (km) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.specs.range_km}
                      onChange={(e) => setFormData({
                        ...formData,
                        specs: { ...formData.specs, range_km: parseInt(e.target.value) || 0 },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base</label>
                    <input
                      type="text"
                      value={formData.specs.base}
                      onChange={(e) => setFormData({
                        ...formData,
                        specs: { ...formData.specs, base: e.target.value },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pilots</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.specs.pilots}
                      onChange={(e) => setFormData({
                        ...formData,
                        specs: { ...formData.specs, pilots: parseInt(e.target.value) || 2 },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year of Manufacture</label>
                    <input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={formData.specs.yearOfManufacture}
                      onChange={(e) => setFormData({
                        ...formData,
                        specs: { ...formData.specs, yearOfManufacture: parseInt(e.target.value) || 0 },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Baggage Capacity</label>
                    <input
                      type="text"
                      value={formData.specs.baggageCapacity}
                      onChange={(e) => setFormData({
                        ...formData,
                        specs: { ...formData.specs, baggageCapacity: e.target.value },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <input
                      type="checkbox"
                      id="flightAttendant"
                      checked={formData.specs.flightAttendant}
                      onChange={(e) => setFormData({
                        ...formData,
                        specs: { ...formData.specs, flightAttendant: e.target.checked },
                      })}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="flightAttendant" className="text-sm font-medium text-gray-700">Flight Attendant</label>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('image_url', e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                    {formData.image_url && (
                      <img src={formData.image_url} alt="Preview" className="mt-2 h-32 w-auto rounded" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Range Map Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('rangeMapImage', e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                    {formData.rangeMapImage && (
                      <img src={formData.rangeMapImage} alt="Range Map" className="mt-2 h-32 w-auto rounded" />
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="available" className="text-sm font-medium text-gray-700">Available</label>
                </div>
                <div className="flex items-center space-x-2">
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
                  <span>{editingAircraft ? 'Update' : 'Create'} Aircraft</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Aircraft Fleet ({aircraft.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {aircraft.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Plane className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No aircraft found</p>
                  <button
                    onClick={() => {
                      resetForm();
                      setShowForm(true);
                    }}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Add First Aircraft
                  </button>
                </div>
              ) : (
                aircraft.map((ac) => (
                  <div key={ac._id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{ac.name}</h3>
                          <span className="text-sm text-gray-500">({ac.tailNumber})</span>
                          {!ac.available && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Unavailable</span>
                          )}
                          {!ac.isActive && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Type:</span> {ac.category}
                          </div>
                          <div>
                            <span className="font-medium">Seats:</span> {ac.specs?.seats || ac.passenger_capacity}
                          </div>
                          <div>
                            <span className="font-medium">Hourly Rate:</span> {ac.currency} {ac.hourly_rate?.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Commission:</span> {ac.commissionPercentage || 0}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(ac)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(ac._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
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

export default function AdminFleet() {
  return (
    <ProtectedRoute admin={true}>
      <AdminFleetContent />
    </ProtectedRoute>
  );
}
