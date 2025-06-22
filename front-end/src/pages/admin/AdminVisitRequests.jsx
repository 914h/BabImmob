import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Printer } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function AdminVisitRequests() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/visits`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setVisits(data.data);
    } catch (error) {
      console.error('Error fetching visits:', error);
      toast.error('Failed to fetch visits');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'pending': 'bg-yellow-500',
      'confirmed': 'bg-green-500',
      'cancelled': 'bg-red-500',
      'completed': 'bg-blue-500',
    };
    return (
      <Badge className={`${statusColors[status] || 'bg-gray-500'} text-white`}>
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
          <CardTitle>All Visit Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell>{visit.property?.title || '-'}</TableCell>
                  <TableCell>{visit.client?.name || visit.client?.email || '-'}</TableCell>
                  <TableCell>{visit.visit_date ? format(new Date(visit.visit_date), 'dd MMM yyyy', { locale: fr }) : '-'}</TableCell>
                  <TableCell>{visit.visit_time || '-'}</TableCell>
                  <TableCell>{getStatusBadge(visit.status)}</TableCell>
                  <TableCell>{visit.notes || '-'}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const printContent = `
                          <html>
                            <head>
                              <title>Visit for ${visit.property?.title || '-'}</title>
                              <style>
                                body { font-family: Arial, sans-serif; padding: 24px; }
                                h1 { font-size: 1.5rem; margin-bottom: 1rem; }
                                .section { margin-bottom: 0.5rem; }
                                .label { font-weight: bold; }
                              </style>
                            </head>
                            <body>
                              <h1>Visit Summary</h1>
                              <div class="section"><span class="label">Property:</span> ${visit.property?.title || '-'}</div>
                              <div class="section"><span class="label">Client:</span> ${visit.client?.name || visit.client?.email || '-'}</div>
                              <div class="section"><span class="label">Date:</span> ${visit.visit_date ? format(new Date(visit.visit_date), 'dd MMM yyyy', { locale: fr }) : '-'}</div>
                              <div class="section"><span class="label">Time:</span> ${visit.visit_time || '-'}</div>
                              <div class="section"><span class="label">Status:</span> ${visit.status}</div>
                              <div class="section"><span class="label">Notes:</span> ${visit.notes || '-'}</div>
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