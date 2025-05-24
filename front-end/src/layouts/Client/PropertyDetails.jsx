import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bed, Bath, Ruler, MapPin, Building2, CalendarIcon, Clock, Mail, Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import { ClientPropertyApi } from '../../services/ClientPropertyApi';
import { CLIENT_DASHBOARD_ROUTE } from '../../router';
import { useUserContext } from '../../context/UserContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import ContractForm from './ContractForm';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Function to generate a simple random phone number (for display purposes)
const generateRandomPhoneNumber = () => {
  const num1 = Math.floor(Math.random() * 900) + 100; // 100-999
  const num2 = Math.floor(Math.random() * 900) + 100; // 100-999
  const num3 = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  return `+1 (${num1}) ${num2}-${num3}`;
};

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  const [contractRequestNotes, setContractRequestNotes] = useState('');
  const [isVisitDialogOpen, setIsVisitDialogOpen] = useState(false);
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const [showOwnerContact, setShowOwnerContact] = useState(false);

  // Available time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Validate property ID
        if (!id || isNaN(parseInt(id))) {
          throw new Error('Invalid property ID');
        }

        const response = await ClientPropertyApi.getProperty(id);
        
        if (response.data) {
          setProperty(response.data);
        } else {
          throw new Error('Invalid property data received');
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        setError(error.message || 'Failed to fetch property details');
        
        if (error.response?.status === 404 || error.message.includes('No query results')) {
          toast.error("This property no longer exists or has been removed");
        } else {
          toast.error(error.message || "Failed to fetch property details");
        }
        
        // Navigate back after a short delay to show the error message
        setTimeout(() => {
          navigate(CLIENT_DASHBOARD_ROUTE);
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // Basic check if it looks like a URL already (e.g., for random images)
    if (imagePath.startsWith('http') || imagePath.startsWith('data:image')) {
        return imagePath;
    }
    return `${BACKEND_URL}/storage/${imagePath}`;
  };

  const nextImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const handleScheduleVisit = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/visits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          property_id: id,
          visit_date: selectedDate,
          visit_time: selectedTime,
          notes: visitNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule visit');
      }

      const data = await response.json();
      toast.success('Visit scheduled successfully!');
      setIsVisitDialogOpen(false);
      setSelectedDate(null);
      setSelectedTime('');
      setVisitNotes('');
    } catch (error) {
      console.error('Error scheduling visit:', error);
      toast.error(error.message || 'Failed to schedule visit');
    }
  };

  const handleRequestContract = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/contract-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          property_id: id,
          notes: contractRequestNotes,
        }),
      });

      if (response.ok) {
        setIsContractDialogOpen(false);
        toast.success('Contract request sent successfully!');
      } else {
        throw new Error('Failed to request contract');
      }
    } catch (error) {
      console.error('Error requesting contract:', error);
      toast.error(error.message || 'Failed to request contract');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => navigate(CLIENT_DASHBOARD_ROUTE)}>
          Back to Properties
        </Button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Property not found</p>
        <Button onClick={() => navigate(CLIENT_DASHBOARD_ROUTE)}>
          Back to Properties
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        onClick={() => navigate(CLIENT_DASHBOARD_ROUTE)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Properties
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Property Images */}
        <div className="space-y-4">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <img
              src={property.images && property.images.length > 0 && property.images[currentImageIndex] 
                ? getImageUrl(property.images[currentImageIndex])
                : 'https://picsum.photos/800/600'} // Use random image URL if no images
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://picsum.photos/800/600'; // Use random image URL on error too
              }}
            />
            {property.images && property.images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  ←
                </Button>
                <Button
                  variant="outline"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  →
                </Button>
              </>
            )}
          </div>
          {property.images && property.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {property.images.map((image, index) => (
                <img
                  key={index}
                  src={getImageUrl(image)}
                  alt={`Property ${index + 1}`}
                  className={`w-full h-24 object-cover rounded-lg cursor-pointer ${
                    index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{property.title}</h1>
            <p className="text-xl text-blue-600 dark:text-blue-400 mt-1">{property.price} €</p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 flex items-center gap-1"><MapPin className="h-4 w-4" />{property.address}, {property.city}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary" className="flex items-center gap-1"><Building2 className="h-4 w-4" />{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1"><Bed className="h-4 w-4" />{property.rooms} Rooms</Badge>
            <Badge variant="secondary" className="flex items-center gap-1"><Ruler className="h-4 w-4" />{property.surface} m²</Badge>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-300">{property.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">

             {/* Schedule Visit Dialog */}
              <Dialog open={isVisitDialogOpen} onOpenChange={setIsVisitDialogOpen}>
                <DialogTrigger asChild>
                   <Button>Schedule a Visit</Button>
                </DialogTrigger>
                 <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule a Visit</DialogTitle>
                     <DialogDescription>Select a date and time for your visit.</DialogDescription>
                  </DialogHeader>
                   <div className="grid gap-4 py-4">
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">Date</Label>
                         <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          className="rounded-md border col-span-3"
                           />
                     </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">Time</Label>
                        <Select onValueChange={setSelectedTime}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a time slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map(slot => (
                                <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                     </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="notes" className="text-right">Notes</Label>
                         <Textarea id="notes" value={visitNotes} onChange={(e) => setVisitNotes(e.target.value)} className="col-span-3" />
                      </div>
                   </div>
                   <Button onClick={handleScheduleVisit} disabled={!selectedDate || !selectedTime}>Submit Visit Request</Button>
                 </DialogContent>
              </Dialog>

              {/* Request Contract Dialog */}
              <Dialog open={isContractDialogOpen} onOpenChange={setIsContractDialogOpen}>
                <DialogTrigger asChild>
                   <Button variant="outline">Request Contract</Button>
                </DialogTrigger>
                 <DialogContent className="sm:max-w-[425px]">
                    <ContractForm propertyId={property.id} onClose={() => setIsContractDialogOpen(false)} />
                 </DialogContent>
              </Dialog>

            {/* Contact Owner Button */}
            <Button variant="outline" onClick={() => setShowOwnerContact(!showOwnerContact)}>
              {showOwnerContact ? 'Hide Contact Info' : 'Contact Owner'}
            </Button>
          </div>

          {/* Owner Contact Info (Conditionally Displayed)*/}
          {showOwnerContact && property.owner && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Owner Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <User className="h-5 w-5" />
                  <p><span className="font-medium">Name:</span> {property.owner.name}</p>
                </div>
                {/* Display owner phone if available, otherwise a random one */}
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Phone className="h-5 w-5" />
                    <p><span className="font-medium">Phone:</span> {property.owner.phone || generateRandomPhoneNumber()}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail className="h-5 w-5" />
                  <p><span className="font-medium">Email:</span> {property.owner.email}</p>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
} 