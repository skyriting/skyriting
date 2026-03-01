import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Plus, Edit2, Trash2, ArrowLeft, Save, X, Eye } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';

function AdminPricingContent() {
  const navigate = useNavigate();
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [previewRule, setPreviewRule] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
    marginPercentage: 0,
    marginByAircraftType: {
      Light: 0,
      Mid: 0,
      'Super Mid': 0,
      Large: 0,
      Airliner: 0,
      Helicopter: 0,
    },
    taxRate: 0,
    taxName: 'GST',
    fees: {
      fuelSurchargePerKm: 0,
      airportFeePerLeg: 0,
      groundHandling: 0,
      crewExpensePerHour: 0,
    },
    multiLegRules: {
      maxLegs: 10,
      minLayoverHours: 1,
      multiLegDiscount: 0,
      applyDiscountAfterLegs: 3,
    },
    defaultCurrency: 'USD',
    supportedCurrencies: ['USD'],
    flightTimeBuffer: 0.5,
    appliesTo: {
      allAircraft: true,
      aircraftTypes: [] as string[],
      specificAircraft: [] as string[],
    },
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: '',
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    const token = localStorage.getItem('skyriting_admin_token');
    if (!token) {
      navigate('/3636847rgyuvfu3f/98184t763gvf/login');
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

    try {
      const response = await fetch(`${API_URL}/admin/pricing-rules`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pricing rules');
      }

      const data = await response.json();
      setRules(data.rules || []);
    } catch (error) {
      console.error('Error fetching pricing rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('skyriting_admin_token');
    if (!token) return;

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

    try {
      const url = editingRule
        ? `${API_URL}/admin/pricing-rules/${editingRule._id}`
        : `${API_URL}/admin/pricing-rules`;

      const method = editingRule ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save pricing rule');
      }

      setShowForm(false);
      setEditingRule(null);
      resetForm();
      fetchRules();
    } catch (error) {
      console.error('Error saving pricing rule:', error);
      alert('Failed to save pricing rule');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing rule?')) return;

    const token = localStorage.getItem('skyriting_admin_token');
    if (!token) return;

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

    try {
      const response = await fetch(`${API_URL}/admin/pricing-rules/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete pricing rule');
      }

      fetchRules();
    } catch (error) {
      console.error('Error deleting pricing rule:', error);
      alert('Failed to delete pricing rule');
    }
  };

  const handleEdit = (rule: any) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name || '',
      isActive: rule.isActive ?? true,
      marginPercentage: rule.marginPercentage || 0,
      marginByAircraftType: rule.marginByAircraftType || {
        Light: 0,
        Mid: 0,
        'Super Mid': 0,
        Large: 0,
        Airliner: 0,
        Helicopter: 0,
      },
      taxRate: rule.taxRate || 0,
      taxName: rule.taxName || 'GST',
      fees: rule.fees || {
        fuelSurchargePerKm: 0,
        airportFeePerLeg: 0,
        groundHandling: 0,
        crewExpensePerHour: 0,
      },
      multiLegRules: rule.multiLegRules || {
        maxLegs: 10,
        minLayoverHours: 1,
        multiLegDiscount: 0,
        applyDiscountAfterLegs: 3,
      },
      defaultCurrency: rule.defaultCurrency || 'USD',
      supportedCurrencies: rule.supportedCurrencies || ['USD'],
      flightTimeBuffer: rule.flightTimeBuffer || 0.5,
      appliesTo: rule.appliesTo || {
        allAircraft: true,
        aircraftTypes: [],
        specificAircraft: [],
      },
      validFrom: rule.validFrom ? new Date(rule.validFrom).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      validUntil: rule.validUntil ? new Date(rule.validUntil).toISOString().split('T')[0] : '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      isActive: true,
      marginPercentage: 0,
      marginByAircraftType: {
        Light: 0,
        Mid: 0,
        'Super Mid': 0,
        Large: 0,
        Airliner: 0,
        Helicopter: 0,
      },
      taxRate: 0,
      taxName: 'GST',
      fees: {
        fuelSurchargePerKm: 0,
        airportFeePerLeg: 0,
        groundHandling: 0,
        crewExpensePerHour: 0,
      },
      multiLegRules: {
        maxLegs: 10,
        minLayoverHours: 1,
        multiLegDiscount: 0,
        applyDiscountAfterLegs: 3,
      },
      defaultCurrency: 'USD',
      supportedCurrencies: ['USD'],
      flightTimeBuffer: 0.5,
      appliesTo: {
        allAircraft: true,
        aircraftTypes: [],
        specificAircraft: [],
      },
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: '',
    });
    setEditingRule(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing rules...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Pricing Rules</h1>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Plus className="h-5 w-5" />
              <span>New Rule</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingRule ? 'Edit Pricing Rule' : 'Create Pricing Rule'}
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
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-6">
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

              {/* Margin Configuration */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Margin Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Global Margin (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.marginPercentage}
                      onChange={(e) => setFormData({ ...formData, marginPercentage: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Margin by Aircraft Type (%)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.keys(formData.marginByAircraftType).map((type) => (
                      <div key={type}>
                        <label className="block text-xs text-gray-600 mb-1">{type}</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={formData.marginByAircraftType[type as keyof typeof formData.marginByAircraftType]}
                          onChange={(e) => setFormData({
                            ...formData,
                            marginByAircraftType: {
                              ...formData.marginByAircraftType,
                              [type]: parseFloat(e.target.value) || 0,
                            },
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tax Configuration */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.taxRate}
                      onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Name</label>
                    <input
                      type="text"
                      value={formData.taxName}
                      onChange={(e) => setFormData({ ...formData, taxName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Fees */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Structure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Surcharge (per km)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.fees.fuelSurchargePerKm}
                      onChange={(e) => setFormData({
                        ...formData,
                        fees: { ...formData.fees, fuelSurchargePerKm: parseFloat(e.target.value) || 0 },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Airport Fee (per leg)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.fees.airportFeePerLeg}
                      onChange={(e) => setFormData({
                        ...formData,
                        fees: { ...formData.fees, airportFeePerLeg: parseFloat(e.target.value) || 0 },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ground Handling</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.fees.groundHandling}
                      onChange={(e) => setFormData({
                        ...formData,
                        fees: { ...formData.fees, groundHandling: parseFloat(e.target.value) || 0 },
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
                      value={formData.fees.crewExpensePerHour}
                      onChange={(e) => setFormData({
                        ...formData,
                        fees: { ...formData.fees, crewExpensePerHour: parseFloat(e.target.value) || 0 },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Multi-leg Rules */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Leg Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Legs</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.multiLegRules.maxLegs}
                      onChange={(e) => setFormData({
                        ...formData,
                        multiLegRules: { ...formData.multiLegRules, maxLegs: parseInt(e.target.value) || 10 },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Layover (hours)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.multiLegRules.minLayoverHours}
                      onChange={(e) => setFormData({
                        ...formData,
                        multiLegRules: { ...formData.multiLegRules, minLayoverHours: parseFloat(e.target.value) || 1 },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Multi-Leg Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.multiLegRules.multiLegDiscount}
                      onChange={(e) => setFormData({
                        ...formData,
                        multiLegRules: { ...formData.multiLegRules, multiLegDiscount: parseFloat(e.target.value) || 0 },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apply Discount After (legs)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.multiLegRules.applyDiscountAfterLegs}
                      onChange={(e) => setFormData({
                        ...formData,
                        multiLegRules: { ...formData.multiLegRules, applyDiscountAfterLegs: parseInt(e.target.value) || 3 },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Currency & Other Settings */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                    <input
                      type="text"
                      value={formData.defaultCurrency}
                      onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Flight Time Buffer (hours)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.flightTimeBuffer}
                      onChange={(e) => setFormData({ ...formData, flightTimeBuffer: parseFloat(e.target.value) || 0.5 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                    <input
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until (optional)</label>
                    <input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
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
                  <span>{editingRule ? 'Update' : 'Create'} Rule</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Pricing Rules ({rules.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {rules.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No pricing rules found</p>
                  <button
                    onClick={() => {
                      resetForm();
                      setShowForm(true);
                    }}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Create First Rule
                  </button>
                </div>
              ) : (
                rules.map((rule) => (
                  <div key={rule._id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Margin:</span> {rule.marginPercentage}%
                          </div>
                          <div>
                            <span className="font-medium">Tax:</span> {rule.taxRate}% ({rule.taxName})
                          </div>
                          <div>
                            <span className="font-medium">Currency:</span> {rule.defaultCurrency}
                          </div>
                          <div>
                            <span className="font-medium">Valid From:</span> {new Date(rule.validFrom).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(rule)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(rule._id)}
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

export default function AdminPricing() {
  return (
    <ProtectedRoute admin={true}>
      <AdminPricingContent />
    </ProtectedRoute>
  );
}
