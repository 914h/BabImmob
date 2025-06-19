import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Download, Printer, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function ClientContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editContract, setEditContract] = useState(null);
  const [editForm, setEditForm] = useState({ type: '', start_date: '', end_date: '', total_amount: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/contracts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setContracts(data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast.error('Failed to fetch contracts');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'pending': 'bg-yellow-500',
      'approved': 'bg-green-500',
      'rejected': 'bg-red-500',
      'active': 'bg-blue-500',
      'completed': 'bg-gray-500',
    };

    return (
      <Badge className={`${statusColors[status]} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const downloadPdf = async (contract) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BACKEND_URL}/api/contrats/${contract.id}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf',
        },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contrat-${contract.contract_number || contract.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        toast.error('Failed to download PDF.');
      }
    } catch (err) {
      toast.error('Failed to download PDF.');
    }
  };

  const deleteContract = async (contractId) => {
    if (!window.confirm('Are you sure you want to delete this contract?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BACKEND_URL}/api/contrats/${contractId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (response.ok) {
        toast.success('Contract deleted successfully.');
        setContracts(contracts.filter(c => c.id !== contractId));
      } else {
        toast.error('Failed to delete contract.');
      }
    } catch (err) {
      toast.error('Failed to delete contract.');
    }
  };

  const openEditDialog = (contract) => {
    setEditContract(contract);
    setEditForm({
      type: contract.type,
      start_date: contract.start_date || '',
      end_date: contract.end_date || '',
      total_amount: contract.total_amount || '',
      description: contract.description || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BACKEND_URL}/api/contrats/${editContract.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        toast.success('Contract updated successfully.');
        setEditContract(null);
        fetchContracts();
      } else {
        toast.error('Failed to update contract.');
      }
    } catch (err) {
      toast.error('Failed to update contract.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract Number</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>{contract.contract_number}</TableCell>
                  <TableCell>{contract.property.title}</TableCell>
                  <TableCell>{contract.owner.name}</TableCell>
                  <TableCell>{contract.type === 'rent' ? 'Rental' : 'Sale'}</TableCell>
                  <TableCell>
                    {contract.start_date ? format(new Date(contract.start_date), 'dd MMM yyyy', { locale: fr }) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {contract.end_date ? format(new Date(contract.end_date), 'dd MMM yyyy', { locale: fr }) : 'N/A'}
                  </TableCell>
                  <TableCell>{contract.total_amount} €</TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {/* <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadPdf(contract)}
                      >
                        <Download className="h-4 w-4" />
                         PDF
                      </Button> */}
                      <Button
                        size="sm"
                        variant="outline"
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
                                <div class="section"><span class="label">Contract Number:</span> ${contract.contract_number}</div>
                                <div class="section"><span class="label">Type:</span> ${contract.type === 'sale' ? 'Sale' : 'Rent'}</div>
                                <div class="section"><span class="label">Start Date:</span> ${contract.start_date || ''}</div>
                                <div class="section"><span class="label">End Date:</span> ${contract.end_date || 'N/A'}</div>
                                <div class="section"><span class="label">Price:</span> ${contract.total_amount} €</div>
                                <div class="section"><span class="label">Status:</span> ${contract.status}</div>
                                <div class="section"><span class="label">Description:</span> ${contract.description || 'N/A'}</div>
                              </body>
                            </html>
                          `);
                          printWindow.document.close();
                          printWindow.focus();
                          printWindow.print();
                        }}
                        title="Print this contract"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(contract)}
                        title="Update this contract"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteContract(contract.id)}
                        title="Delete this contract"
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Contract Dialog */}
      <Dialog open={!!editContract} onOpenChange={(open) => { if (!open) setEditContract(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Contract</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Type</label>
              <select name="type" value={editForm.type} onChange={handleEditChange} className="w-full border rounded p-2">
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <Input type="date" name="start_date" value={editForm.start_date} onChange={handleEditChange} />
            </div>
            <div>
              <label className="block text-sm font-medium">End Date</label>
              <Input type="date" name="end_date" value={editForm.end_date} onChange={handleEditChange} />
            </div>
            <div>
              <label className="block text-sm font-medium">Amount</label>
              <Input type="number" name="total_amount" value={editForm.total_amount} onChange={handleEditChange} />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <Input name="description" value={editForm.description} onChange={handleEditChange} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditContract(null)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 text-white">Update</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 