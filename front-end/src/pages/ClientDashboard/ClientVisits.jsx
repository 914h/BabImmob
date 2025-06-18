import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RefreshCw, AlertCircle, Printer } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function ClientVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log('Fetching visits from:', `${BACKEND_URL}/api/visits`);
      console.log('Token:', token.substring(0, 20) + '...');

      // First, test authentication
      const authResponse = await fetch(`${BACKEND_URL}/api/test-auth`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('Auth test response status:', authResponse.status);
      if (authResponse.ok) {
        const authData = await authResponse.json();
        console.log('Auth test data:', authData);
      } else {
        console.error('Auth test failed:', authResponse.status);
      }

      const response = await fetch(`${BACKEND_URL}/api/visits`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to view visits.');
        } else if (response.status === 404) {
          throw new Error('Visits endpoint not found. Please check the API configuration.');
        } else {
          throw new Error(`Server error: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }
      }

      const data = await response.json();
      console.log('Visits data:', data);
      setVisits(data);
    } catch (error) {
      console.error('Error fetching visits:', error);
      setError(error.message);
      toast.error(`Failed to fetch visits: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // You might want a status badge for visits too, depending on your backend model
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

  const printVisit = (visit) => {
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>BabImmob | Gestion Dimobbilier</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 2rem; }
            h1 { color: #2563eb; }
            .label { font-weight: bold; }
            .section { margin-bottom: 1rem; }
          </style>
        </head>
        <body>
          <h1>BabImmob | Gestion Dimobbilier</h1>
          <div class="section"><span class="label">Property:</span> ${visit.property?.title || 'Unknown Property'}</div>
          <div class="section"><span class="label">Date:</span> ${visit.visit_date ? new Date(visit.visit_date).toLocaleDateString() : ''}</div>
          <div class="section"><span class="label">Time:</span> ${visit.visit_time ? formatTimeAMPM(visit.visit_time) : 'N/A'}</div>
          <div class="section"><span class="label">Status:</span> ${visit.status}</div>
          <div class="section"><span class="label">Notes:</span> ${visit.notes || 'No notes'}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  function formatTimeAMPM(time) {
    if (!time) return '';
    // Handles both HH:mm and HH:mm:ss
    const [h, m] = time.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${m} ${ampm}`;
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>My Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary-modern" />
              <span className="ml-2">Loading visits...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>My Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                onClick={fetchVisits}
                className="bg-primary-modern hover:bg-blue-600 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Visits</CardTitle>
          <Button 
            onClick={fetchVisits}
            variant="outline"
            size="sm"
            className="hover-primary"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {visits.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No visits scheduled yet.</p>
              <p className="text-sm text-gray-400">
                Schedule a visit from any property page to see it here.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Print</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell className="font-medium">
                      {visit.property?.title || 'Unknown Property'}
                    </TableCell>
                    <TableCell>
                      {visit.visit_date ? format(new Date(visit.visit_date), 'dd MMM yyyy', { locale: fr }) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {visit.visit_time ? formatTimeAMPM(visit.visit_time) : 'N/A'}
                    </TableCell>
                    <TableCell>{getStatusBadge(visit.status)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {visit.notes || 'No notes'}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="icon" onClick={() => printVisit(visit)} title="Print this visit">
                        <Printer className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 