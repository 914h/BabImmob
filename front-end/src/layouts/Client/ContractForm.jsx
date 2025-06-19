import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { format } from 'date-fns';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function ContractForm({ propertyId, onSuccess, propertyPrice }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'rent',
    duration: '1', // 1 month, 3 months, 6 months, 1 year
    start_date: '',
    end_date: '',
    price: '',
    description: '',
  });
  const [createdContrat, setCreatedContrat] = useState(null);

  // Calculate end date based on start date and duration
  useEffect(() => {
    if (formData.start_date && formData.type === 'rent') {
      const start = new Date(formData.start_date);
      const months = parseInt(formData.duration);
      const end = new Date(start);
      end.setMonth(end.getMonth() + months);
      setFormData(prev => ({
        ...prev,
        end_date: end.toISOString().split('T')[0]
      }));
    }
  }, [formData.start_date, formData.duration, formData.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const contractData = {
        property_id: propertyId,
        type: formData.type,
        price: parseFloat(propertyPrice),
        description: formData.description,
        payment_terms: 'Monthly', // Default payment terms
      };

      if (formData.type === 'rent') {
        contractData.start_date = formData.start_date;
        contractData.end_date = formData.end_date;
        contractData.duration = formData.duration;
      }

      const response = await fetch(`${BACKEND_URL}/api/contrats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
        body: JSON.stringify(contractData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create contract');
      }

      const data = await response.json();
      toast.success('Contract created successfully!');
      setCreatedContrat(data);
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      toast.error(error.message || 'Failed to create contract');
    } finally {
      setLoading(false);
    }
  };

  // Format price for display
  const formattedPrice = propertyPrice ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(propertyPrice) : '';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Contract</CardTitle>
      </CardHeader>
      <CardContent>
        {createdContrat ? (
          <div className="space-y-4">
            <p className="text-green-600 font-semibold">Contract created successfully!</p>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div><b>Contract Number:</b> {createdContrat.contract_number}</div>
              <div><b>Type:</b> {createdContrat.type === 'sale' ? 'Sale' : 'Rent'}</div>
              <div><b>Start Date:</b> {createdContrat.start_date}</div>
              <div><b>End Date:</b> {createdContrat.end_date || 'N/A'}</div>
              <div><b>Price:</b> {createdContrat.total_amount} €</div>
              <div><b>Status:</b> {createdContrat.status}</div>
              <div><b>Description:</b> {createdContrat.description || 'N/A'}</div>
            </div>
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => {
                const printWindow = window.open('', '', 'width=800,height=600');
                printWindow.document.write(`
                  <html>
                    <head>
                      <title>Contract Print</title>
                      <style>
                        body { font-family: Arial, sans-serif; padding: 2rem; }
                        h1 { color: #2563eb; }
                        .label { font-weight: bold; }
                        .section { margin-bottom: 1rem; }
                      </style>
                    </head>
                    <body>
                      <h1>Contract Summary</h1>
                      <div class="section"><span class="label">Contract Number:</span> ${createdContrat.contract_number}</div>
                      <div class="section"><span class="label">Type:</span> ${createdContrat.type === 'sale' ? 'Sale' : 'Rent'}</div>
                      <div class="section"><span class="label">Start Date:</span> ${createdContrat.start_date || ''}</div>
                      <div class="section"><span class="label">End Date:</span> ${createdContrat.end_date || 'N/A'}</div>
                      <div class="section"><span class="label">Price:</span> ${createdContrat.total_amount} €</div>
                      <div class="section"><span class="label">Status:</span> ${createdContrat.status}</div>
                      <div class="section"><span class="label">Description:</span> ${createdContrat.description || 'N/A'}</div>
                    </body>
                  </html>
                `);
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
              }}
            >
              Print Contract
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Contract Type</label>
              <Select
                name="type"
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === 'rent' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <Select
                    name="duration"
                    value={formData.duration}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required={formData.type === 'rent'}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input
                type="text"
                name="price"
                value={formattedPrice}
                disabled
                className="bg-gray-100"
              />
              <p className="text-sm text-gray-500">
                Original property price
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter contract details..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Contract'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
} 