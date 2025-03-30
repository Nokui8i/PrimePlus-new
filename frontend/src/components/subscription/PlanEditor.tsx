import React, { useState, useEffect } from 'react';
import { SubscriptionPlan } from '@/types/subscription';

interface PlanEditorProps {
  plan?: SubscriptionPlan | null; // If null, creating a new plan
  onSave: (plan: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const PlanEditor: React.FC<PlanEditorProps> = ({ plan, onSave, onCancel }) => {
  const isEditing = !!plan;
  
  const [formData, setFormData] = useState<Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    price: 99,
    currency: 'ILS',
    interval: 'monthly',
    features: [''],
    isPublic: true,
    isActive: true,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (plan) {
      const { id, createdAt, updatedAt, ...rest } = plan;
      setFormData(rest);
    }
  }, [plan]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'שם התוכנית נדרש';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'תיאור התוכנית נדרש';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'המחיר חייב להיות גדול מאפס';
    }
    
    if (formData.features.length === 0 || (formData.features.length === 1 && !formData.features[0])) {
      newErrors.features = 'לפחות תכונה אחת נדרשת';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features.filter(f => f.trim()), featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleFeatureKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">
        {isEditing ? 'עריכת תוכנית מנוי' : 'יצירת תוכנית מנוי חדשה'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Plan Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            שם התוכנית
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        {/* Plan Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            תיאור התוכנית
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>
        
        {/* Price and Interval */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              מחיר
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₪</span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                min="0"
                step="1"
                value={formData.price}
                onChange={handleNumberChange}
                className={`block w-full rounded-md border ${errors.price ? 'border-red-500' : 'border-gray-300'} pr-3 pl-10 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              />
            </div>
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>
          
          <div>
            <label htmlFor="interval" className="block text-sm font-medium text-gray-700">
              תקופת חיוב
            </label>
            <select
              name="interval"
              id="interval"
              value={formData.interval}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            >
              <option value="monthly">חודשי</option>
              <option value="yearly">שנתי</option>
            </select>
          </div>
        </div>
        
        {/* Features */}
        <div>
          <label htmlFor="features" className="block text-sm font-medium text-gray-700">
            תכונות התוכנית
          </label>
          <div className={`mt-1 border ${errors.features ? 'border-red-500' : 'border-gray-300'} rounded-md p-3`}>
            <ul className="space-y-2 mb-3">
              {formData.features.filter(f => f.trim()).map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="flex-grow">{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="flex">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={handleFeatureKeyDown}
                placeholder="הוסף תכונה חדשה"
                className="flex-grow block rounded-md border-gray-300 shadow-sm py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="ml-2 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                הוסף
              </button>
            </div>
            {errors.features && <p className="mt-1 text-sm text-red-600">{errors.features}</p>}
          </div>
        </div>
        
        {/* Visibility and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPublic"
              id="isPublic"
              checked={formData.isPublic}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
              פומבי (מוצג בדף המנויים)
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              פעיל (ניתן להירשם)
            </label>
          </div>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEditing ? 'Update Plan' : 'Create Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlanEditor; 