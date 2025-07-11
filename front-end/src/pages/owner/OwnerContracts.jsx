import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Download, Check, X, Printer } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function OwnerContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/owner/contracts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setContracts(data.data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast.error('Failed to fetch contracts');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (contractId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/owner/contracts/${contractId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve contract');
      }

      toast.success('Contract approved successfully');
      fetchContracts(); // Refresh the list
    } catch (error) {
      console.error('Error approving contract:', error);
      toast.error('Failed to approve contract');
    }
  };

  const handleReject = async (contractId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/owner/contracts/${contractId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject contract');
      }

      toast.success('Contract rejected successfully');
      fetchContracts(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting contract:', error);
      toast.error('Failed to reject contract');
    }
  };

  const handlePrint = (contract) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Contract Details</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { margin-bottom: 20px; }
            table { border-collapse: collapse; width: 100%; }
            td, th { border: 1px solid #ddd; padding: 8px; }
            th { background: #f4f4f4; }
          </style>
        </head>
        <body>
          <h2>Contract Details</h2>
          <table>
            <tr><th>Contract Number</th><td>${contract.contract_number}</td></tr>
            <tr><th>Property</th><td>${contract.property?.title || ''}</td></tr>
            <tr><th>Client</th><td>${contract.client?.name || ''}</td></tr>
            <tr><th>Type</th><td>${contract.type === 'rent' ? 'Rental' : 'Sale'}</td></tr>
            <tr><th>Start Date</th><td>${contract.start_date ? new Date(contract.start_date).toLocaleDateString('fr-FR') : ''}</td></tr>
            <tr><th>End Date</th><td>${contract.end_date ? new Date(contract.end_date).toLocaleDateString('fr-FR') : ''}</td></tr>
            <tr><th>Amount</th><td>${contract.total_amount} €</td></tr>
            <tr><th>Status</th><td>${contract.status}</td></tr>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
                <TableHead>Client</TableHead>
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
                  <TableCell>{contract.client.name}</TableCell>
                  <TableCell>{contract.type === 'rent' ? 'Rental' : 'Sale'}</TableCell>
                  <TableCell>
                    {format(new Date(contract.start_date), 'dd MMM yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {contract.end_date && format(new Date(contract.end_date), 'dd MMM yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell>{contract.total_amount} €</TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {contract.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600"
                            onClick={() => handleApprove(contract.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleReject(contract.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePrint(contract)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 