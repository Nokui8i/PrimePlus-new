import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface PaymentMethodFormProps {
  onSave: (data: PaymentMethodData) => void;
  onCancel: () => void;
  initialData?: PaymentMethodData;
}

export interface PaymentMethodData {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
}

export default function PaymentMethodForm({ onSave, onCancel, initialData }: PaymentMethodFormProps) {
  const [formData, setFormData] = useState<PaymentMethodData>(
    initialData || {
      cardNumber: '',
      cardholderName: '',
      expiryDate: '',
      cvv: '',
    }
  );
  const [errors, setErrors] = useState<Partial<PaymentMethodData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number input with spaces after every 4 digits
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/\D/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim()
        .slice(0, 19); // Limit to 16 digits plus spaces
      
      setFormData({ ...formData, [name]: formattedValue });
      return;
    }
    
    // Format expiry date as MM/YY
    if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(.{2})/, '$1/')
        .slice(0, 5);
      
      setFormData({ ...formData, [name]: formattedValue });
      return;
    }
    
    // Format CVV to only allow 3-4 digits
    if (name === 'cvv') {
      const formattedValue = value
        .replace(/\D/g, '')
        .slice(0, 4);
      
      setFormData({ ...formData, [name]: formattedValue });
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentMethodData> = {};
    
    // Validate card number (16 digits)
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    // Validate cardholder name
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    
    // Validate expiry date (should be in MM/YY format)
    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    } else {
      // Check if expiry date is in the future
      const [month, yearShort] = formData.expiryDate.split('/');
      const year = 2000 + parseInt(yearShort);
      const expiryDate = new Date(year, parseInt(month) - 1, 1);
      const today = new Date();
      
      if (expiryDate < today) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    // Validate CVV (3-4 digits)
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV code';
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="cardholderName"
        name="cardholderName"
        label="Cardholder Name"
        placeholder="John Doe"
        value={formData.cardholderName}
        onChange={handleChange}
        error={errors.cardholderName}
        required
      />
      
      <Input
        id="cardNumber"
        name="cardNumber"
        label="Card Number"
        placeholder="1234 5678 9012 3456"
        value={formData.cardNumber}
        onChange={handleChange}
        error={errors.cardNumber}
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="expiryDate"
          name="expiryDate"
          label="Expiry Date"
          placeholder="MM/YY"
          value={formData.expiryDate}
          onChange={handleChange}
          error={errors.expiryDate}
          required
        />
        
        <Input
          id="cvv"
          name="cvv"
          label="CVV"
          placeholder="123"
          value={formData.cvv}
          onChange={handleChange}
          error={errors.cvv}
          required
        />
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Payment Method
        </Button>
      </div>
    </form>
  );
}