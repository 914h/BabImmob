import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Download, Printer } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function AdminContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/contracts`, {
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
          <CardTitle>All Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract Number</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Owner</TableHead>
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
                  <TableCell>{contract.property?.title || '-'}</TableCell>
                  <TableCell>{contract.owner?.name || contract.owner?.email || '-'}</TableCell>
                  <TableCell>{contract.client?.name || contract.client?.email || '-'}</TableCell>
                  <TableCell>{contract.type === 'rent' ? 'Rental' : 'Sale'}</TableCell>
                  <TableCell>
                    {contract.start_date ? format(new Date(contract.start_date), 'dd MMM yyyy', { locale: fr }) : '-' }
                  </TableCell>
                  <TableCell>
                    {contract.end_date ? format(new Date(contract.end_date), 'dd MMM yyyy', { locale: fr }) : '-' }
                  </TableCell>
                  <TableCell>{contract.total_amount} €</TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const printContent = `
                          <html>
                            <head>
                              <title>Contract ${contract.contract_number}</title>
                              <style>
                                body { font-family: Arial, sans-serif; padding: 24px; }
                                h1 { font-size: 1.5rem; margin-bottom: 1rem; }
                                .section { margin-bottom: 0.5rem; }
                                .label { font-weight: bold; }
                              </style>
                            </head>
                            <body>
                              <h1>Contract Summary</h1>
                              <div class="section"><span class="label">Contract Number:</span> ${contract.contract_number}</div>
                              <div class="section"><span class="label">Property:</span> ${contract.property?.title || '-'}</div>
                              <div class="section"><span class="label">Owner:</span> ${contract.owner?.name || contract.owner?.email || '-'}</div>
                              <div class="section"><span class="label">Client:</span> ${contract.client?.name || contract.client?.email || '-'}</div>
                              <div class="section"><span class="label">Type:</span> ${contract.type === 'sale' ? 'Sale' : 'Rental'}</div>
                              <div class="section"><span class="label">Start Date:</span> ${contract.start_date ? format(new Date(contract.start_date), 'dd MMM yyyy', { locale: fr }) : '-'}</div>
                              <div class="section"><span class="label">End Date:</span> ${contract.end_date ? format(new Date(contract.end_date), 'dd MMM yyyy', { locale: fr }) : '-'}</div>
                              <div class="section"><span class="label">Amount:</span> ${contract.total_amount} €</div>
                              <div class="section"><span class="label">Status:</span> ${contract.status}</div>
                            </body>
                          </html>
                        `;
                        const printWindow = window.open('', '', 'width=800,height=600');
                        printWindow.document.write(printContent);
                        printWindow.document.close();
                        printWindow.focus();
                        printWindow.print();
                      }}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
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