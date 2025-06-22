import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import { ArrowLeft, Edit2 } from "lucide-react";
import { toast } from "sonner";
import PropertyApi from "../../../services/api/PropertyApi";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge.tsx";
import { getPropertyImage } from "../../../utils/propertyImages";
import { useUserContext } from '../../../context/UserContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext ? useUserContext() : { user: null };
  const role = user?.role || localStorage.getItem('role');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        let response;
        if (role === 'admin') {
          response = await PropertyApi.getAdmin(id);
        } else {
          response = await PropertyApi.get(id);
        }
        const propertyData = response.data?.data || response.data;
        setProperty(propertyData);
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to fetch property details");
        navigate("/owner/properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, navigate, role]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If the image path is already a full URL, return it
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, construct the full URL
    return `${BACKEND_URL}/storage/${imagePath}`;
  };

  const getImages = () => {
    if (!property?.images) return [];
    // If images is a string, try to parse it as JSON
    if (typeof property.images === 'string') {
      try {
        return JSON.parse(property.images);
      } catch (e) {
        return [property.images]; // If parsing fails, treat it as a single image path
      }
    }
    // If images is already an array, return it
    return Array.isArray(property.images) ? property.images : [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Property not found</p>
      </div>
    );
  }

  const images = getImages();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/owner/properties")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Button>
        <Button
          onClick={() => navigate(`/owner/properties/${id}/edit`)}
          className="flex items-center gap-2"
        >
          <Edit2 className="h-4 w-4" />
          Edit Property
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Images */}
        <Card>
          <CardHeader>
            <CardTitle>Property Images</CardTitle>
          </CardHeader>
          <CardContent>
            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {images.map((image, index) => {
                  const imageUrl = getImageUrl(image);
                  return imageUrl ? (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Property ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getPropertyImage(null, property.type, property.id);
                      }}
                    />
                  ) : (
                    <img
                      key={index}
                      src={getPropertyImage(null, property.type, property.id)}
                      alt={`Property ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={getPropertyImage(null, property.type, property.id)}
                  alt="Property"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Property Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{property.title}</h2>
                <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                  {property.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium capitalize">{property.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">
                    {property.price ? `$${property.price.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Surface Area</p>
                  <p className="font-medium">
                    {property.surface ? `${property.surface} m²` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rooms</p>
                  <p className="font-medium">
                    {property.rooms || 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="mt-1">{property.description || 'No description available'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="mt-1">{property.address || 'No address available'}</p>
                <p className="mt-1">{property.city || 'No city available'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 