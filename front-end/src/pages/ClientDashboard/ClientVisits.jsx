import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RefreshCw, AlertCircle, Printer, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function ClientVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editVisit, setEditVisit] = useState(null);
  const [editForm, setEditForm] = useState({ visit_date: '', visit_time: '', status: '', notes: '' });

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

  const openEditDialog = (visit) => {
    setEditVisit(visit);
    setEditForm({
      visit_date: visit.visit_date ? visit.visit_date.split('T')[0] : '',
      visit_time: visit.visit_time || '',
      status: visit.status || '',
      notes: visit.notes || '',
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
      const response = await fetch(`${BACKEND_URL}/api/visits/${editVisit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        toast.success('Visit updated successfully.');
        setEditVisit(null);
        fetchVisits();
      } else {
        toast.error('Failed to update visit.');
      }
    } catch (err) {
      toast.error('Failed to update visit.');
    }
  };

  const deleteVisit = async (visitId) => {
    if (!window.confirm('Are you sure you want to delete this visit?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BACKEND_URL}/api/visits/${visitId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (response.ok) {
        toast.success('Visit deleted successfully.');
        setVisits(visits.filter(v => v.id !== visitId));
      } else {
        toast.error('Failed to delete visit.');
      }
    } catch (err) {
      toast.error('Failed to delete visit.');
    }
  };

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
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => printVisit(visit)} title="Print this visit">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(visit)} title="Update this visit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => deleteVisit(visit.id)} title="Delete this visit" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {/* Edit Visit Dialog */}
      <Dialog open={!!editVisit} onOpenChange={(open) => { if (!open) setEditVisit(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Visit</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Date</label>
              <Input type="date" name="visit_date" value={editForm.visit_date} onChange={handleEditChange} />
            </div>
            <div>
              <label className="block text-sm font-medium">Time</label>
              <Input type="text" name="visit_time" value={editForm.visit_time} onChange={handleEditChange} />
            </div>
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select name="status" value={editForm.status} onChange={handleEditChange} className="w-full border rounded p-2">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Notes</label>
              <Input name="notes" value={editForm.notes} onChange={handleEditChange} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditVisit(null)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 text-white">Update</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 