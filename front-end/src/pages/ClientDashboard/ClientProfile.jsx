import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { useUserContext } from '@/context/UserContext';
import { Loader, User, Mail, Phone, MapPin, Camera } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function ClientProfile() {
  const { user, setUser } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      }));
      
      // Set image preview if user has an image
      if (user.image) {
        setImagePreview(`${BACKEND_URL}/storage/${user.image}`);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('prenom', formData.prenom);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      
      // Only add password if provided
      if (formData.password) {
        if (formData.password !== formData.password_confirmation) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }
        formDataToSend.append('password', formData.password);
      }
      
      // Only append image if a new one was selected
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const response = await fetch(`${BACKEND_URL}/api/client/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      
      // Update user context with new data
      const updatedUser = { ...user, ...data.client };
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        password: '',
        password_confirmation: ''
      }));
      
      // Clear selected image
      setSelectedImage(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  {formData.nom} {formData.prenom}
                </h3>
                <p className="text-gray-500">Click the camera icon to change your photo</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">First Name</Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prenom">Last Name</Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Change Password Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Change Password (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Confirm New Password</Label>
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="min-w-[120px]">
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 