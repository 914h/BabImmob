import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClientPropertyApi } from '@/services/ClientPropertyApi';
import { getPropertyImage } from '../utils/propertyImages';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await ClientPropertyApi.getProperty(id);
        setProperty(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!property) {
    return <div className="p-6 text-center">Property not found</div>;
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        ← Back to Properties
      </Button>

      <Card>
        <CardHeader className="relative">
          <div className="relative">
            <img
              src={property.images[currentImageIndex]?.path 
                ? `http://localhost:8000/storage/${property.images[currentImageIndex].path}`
                : getPropertyImage(null, property.type, property.id)}
              alt={property.title}
              className="w-full h-[400px] object-cover rounded-t-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getPropertyImage(null, property.type, property.id);
              }}
            />
            {property.images.length > 1 && (
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
          {property.images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {property.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <CardTitle className="text-2xl font-bold">{property.title}</CardTitle>
            <span className="text-2xl font-bold text-blue-600">
              ${property.price.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-gray-600">Bedrooms</div>
              <div className="text-xl font-semibold">{property.bedrooms}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-gray-600">Bathrooms</div>
              <div className="text-xl font-semibold">{property.bathrooms}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-gray-600">Area</div>
              <div className="text-xl font-semibold">{property.area} sqft</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{property.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Location</h3>
            <p className="text-gray-600">{property.location}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Property Type</h3>
            <p className="text-gray-600 capitalize">{property.type}</p>
          </div>

          <Button className="w-full bg-primary-modern hover:bg-blue-600 text-white transition-all duration-300">Contact Agent</Button>
        </CardContent>
      </Card>
    </div>
  );
} 