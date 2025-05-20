import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bed, Bath, Ruler, MapPin, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { ClientPropertyApi } from '../../services/ClientPropertyApi';
import { CLIENT_DASHBOARD_ROUTE } from '../../router';
import { useUserContext } from '../../context/UserContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(null);

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
              src={property.images && property.images[currentImageIndex] 
                ? getImageUrl(property.images[currentImageIndex])
                : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
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
            <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              ${property.price.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-gray-600" />
              <span>{property.rooms} Rooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5 text-gray-600" />
              <span>{property.bathrooms || '2'} Bathrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-gray-600" />
              <span>{property.surface} m²</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-600" />
              <span>{property.type}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-5 w-5" />
            <span>{property.address}, {property.city}</span>
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button className="flex-1" size="lg">
              Contact Owner
            </Button>
            <Button variant="outline" className="flex-1" size="lg">
              Schedule Visit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 