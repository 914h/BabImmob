import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, Filter, SortAsc, SortDesc } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getPropertyImage } from "../utils/propertyImages";
import { Pagination } from "../components/ui/pagination";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function PublicProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
    from: 0,
    to: 0,
  });
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [roomsFilter, setRoomsFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchProperties();
  }, [debouncedSearch, propertyType, priceRange, roomsFilter, sortBy, sortOrder, pagination.current_page]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // Build filter parameters
      const params = new URLSearchParams();
      params.append('page', pagination.current_page);
      params.append('per_page', pagination.per_page);
      
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (propertyType !== 'all') params.append('type', propertyType);
      if (sortBy) params.append('sort_by', sortBy);
      if (sortOrder) params.append('sort_order', sortOrder);

      // Add price range filters
      if (priceRange !== 'all') {
        switch (priceRange) {
          case 'low':
            params.append('price_max', '100000');
            break;
          case 'medium':
            params.append('price_min', '100000');
            params.append('price_max', '300000');
            break;
          case 'high':
            params.append('price_min', '300000');
            break;
        }
      }

      // Add rooms filter
      if (roomsFilter !== 'all') {
        params.append('rooms', roomsFilter);
      }

      const response = await fetch(`${BACKEND_URL}/api/properties?${params.toString()}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setProperties(data.data);
        setPagination(prev => ({
          ...prev,
          ...data.pagination,
        }));
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    // For public users, redirect to login with a message
    toast.info('Please log in to view property details');
    navigate('/login');
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      current_page: page,
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPropertyType('all');
    setPriceRange('all');
    setRoomsFilter('all');
    setSortBy('created_at');
    setSortOrder('desc');
    setPagination(prev => ({
      ...prev,
      current_page: 1,
    }));
  };

  const hasActiveFilters = searchQuery || propertyType !== 'all' || priceRange !== 'all' || roomsFilter !== 'all';

  if (loading && properties.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading properties...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Properties</h1>
        <p className="text-gray-600 mt-2">
          Discover our collection of properties
          {pagination.total > 0 && (
            <span className="ml-2 text-sm text-gray-500">
              ({pagination.total} properties found)
            </span>
          )}
        </p>
        <p className="text-sm text-blue-600 mt-2">
          💡 <strong>Tip:</strong> Log in to view detailed property information and contact owners
        </p>
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
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Newest First</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="surface">Surface Area</SelectItem>
              <SelectItem value="rooms">Rooms</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2"
          >
            {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            {sortOrder === 'asc' ? 'Asc' : 'Desc'}
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
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
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">Under $100,000</SelectItem>
                <SelectItem value="medium">$100,000 - $300,000</SelectItem>
                <SelectItem value="high">Over $300,000</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roomsFilter} onValueChange={setRoomsFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Min Rooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Rooms</SelectItem>
                <SelectItem value="1">1+ Rooms</SelectItem>
                <SelectItem value="2">2+ Rooms</SelectItem>
                <SelectItem value="3">3+ Rooms</SelectItem>
                <SelectItem value="4">4+ Rooms</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {properties.map((property) => {
          return (
            <Card key={property.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="p-0">
                <img
                  src={getPropertyImage(property.main_image, property.type, property.id)}
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getPropertyImage(null, property.type, property.id);
                  }}
                />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl font-semibold">{property.title}</CardTitle>
                  <span className="text-lg font-bold text-blue-600">${property.price.toLocaleString()}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{property.rooms} rooms</span>
                  <span>{property.surface} m²</span>
                  <span>{property.city}</span>
                </div>
                <Button 
                  className="w-full mt-4 bg-primary-modern hover:bg-blue-600 text-white transition-all duration-300"
                  onClick={() => handleViewDetails(property.id)}
                >
                  View Details (Login Required)
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
            onPageChange={handlePageChange}
          />
          <div className="text-center text-sm text-gray-500 mt-4">
            Showing {pagination.from} to {pagination.to} of {pagination.total} properties
          </div>
        </div>
      )}

      {properties.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No properties found matching your criteria</p>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-12 text-center bg-blue-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find Your Dream Property?</h2>
        <p className="text-gray-600 mb-6">
          Create an account to access detailed property information, contact owners, and schedule visits.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button variant="outline" onClick={() => navigate('/login')}>
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
} 