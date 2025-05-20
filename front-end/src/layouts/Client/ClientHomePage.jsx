import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ClientPropertyApi } from "../../services/ClientPropertyApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CLIENT_PROPERTY_DETAILS_ROUTE, LOGIN_ROUTE } from "../../router";

export default function ClientHomePage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await ClientPropertyApi.getProperties();
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        if (error.message === 'Unauthenticated.' || error.response?.status === 401) {
          toast.error('Please log in to view properties');
          navigate(LOGIN_ROUTE);
        } else {
          toast.error(error.message || 'Failed to fetch properties');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [navigate]);

  const handleViewDetails = (id) => {
    navigate(CLIENT_PROPERTY_DETAILS_ROUTE.replace(':id', id));
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = !searchQuery || 
      (property.title && property.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (property.description && property.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = propertyType === 'all' || 
      (property.type && property.type === propertyType);
    
    const matchesPrice = priceRange === 'all' || 
      (property.price && (
        (priceRange === 'low' && property.price < 100000) ||
        (priceRange === 'medium' && property.price >= 100000 && property.price < 300000) ||
        (priceRange === 'high' && property.price >= 300000)
      ));
    
    return matchesSearch && matchesType && matchesPrice;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading properties...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Your Dream Property</h1>
        <p className="text-gray-600 mt-2">Browse through our extensive collection of properties</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="low">Under $100,000</SelectItem>
              <SelectItem value="medium">$100,000 - $300,000</SelectItem>
              <SelectItem value="high">Over $300,000</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => {
          return (
            <Card key={property.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="p-0">
                <img
                  src={property.main_image ? `http://localhost:8000/storage/${property.main_image}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='}
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                  }}
                />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl font-semibold">{property.title}</CardTitle>
                  <span className="text-lg font-bold text-blue-600">${property.price.toLocaleString()}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{property.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{property.rooms} rooms</span>
                  <span>{property.surface} m²</span>
                  <span>{property.city}</span>
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => handleViewDetails(property.id)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProperties.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No properties found matching your criteria</p>
          {searchQuery || propertyType !== 'all' || priceRange !== 'all' ? (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setPropertyType('all');
                setPriceRange('all');
              }}
            >
              Clear Filters
            </Button>
          ) : (
            <p className="text-gray-400">Please check back later for new properties</p>
          )}
        </div>
      )}
    </div>
  );
}
