import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import PropertyApi from "../../services/api/PropertyApi";
import { Card, CardContent } from "../../components/ui/card";

const propertySchema = z.object({
  type: z.enum(["apartment", "house", "villa", "land", "commercial"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  surface: z.string().transform((val) => parseFloat(val)),
  rooms: z.string().transform((val) => parseInt(val)),
  price: z.string().transform((val) => parseFloat(val)),
  status: z.enum(["available", "rented", "sold", "pending"]),
  images: z.array(z.instanceof(File)).optional(),
});

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(id);

  const form = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      type: "apartment",
      title: "",
      description: "",
      address: "",
      city: "",
      surface: "",
      rooms: "",
      price: "",
      status: "available",
      images: [],
    },
  });

  useEffect(() => {
    if (isEdit) {
      const fetchProperty = async () => {
        try {
          const response = await PropertyApi.get(id);
          const property = response.data.data;
          
          // Convert images to array if it's a string
          let images = property.images;
          if (typeof images === 'string') {
            try {
              images = JSON.parse(images);
            } catch (e) {
              images = [images];
            }
          }
          
          form.reset({
            ...property,
            surface: property.surface.toString(),
            rooms: property.rooms.toString(),
            price: property.price.toString(),
            images: images || [], // Set existing images
          });
        } catch (error) {
          toast.error("Failed to fetch property details");
          navigate("/owner/properties");
        }
      };
      fetchProperty();
    }
  }, [id, form, isEdit, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Append basic property data
      Object.keys(data).forEach(key => {
        if (key !== 'images') {
          formData.append(key, data[key]);
        }
      });

      // Handle images
      if (data.images && data.images.length > 0) {
        // Clear any existing images array
        formData.delete('images[]');
        formData.delete('existing_images[]');
        
        data.images.forEach((image, index) => {
              if (image instanceof File) {
                formData.append(`images[${index}]`, image);
              } else if (typeof image === 'string') {
                formData.append(`existing_images[${index}]`, image);
              }
            });
          }

      if (isEdit) {
        await PropertyApi.update(id, formData);
        toast.success("Property updated successfully");
      } else {
        await PropertyApi.create(formData);
        toast.success("Property created successfully");
      }
      navigate("/owner/properties");
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = error.response?.data?.message || 
                          (isEdit ? "Failed to update property" : "Failed to create property");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Property" : "Add New Property"}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter property title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter property description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter property address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="surface"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surface Area (m²)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter surface area"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Rooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of rooms"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <div>
                      {/* Show existing images if editing */}
                      {isEdit && value && value.length > 0 && (
                        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                          {value.map((image, index) => (
                            <div key={index} className="relative">
                              {typeof image === 'string' ? (
                                <img
                                  src={`${BACKEND_URL}/storage/${image}`}
                                  alt={`Property ${index + 1}`}
                                  className="w-full h-24 object-cover rounded"
                                />
                              ) : (
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Property ${index + 1}`}
                                  className="w-full h-24 object-cover rounded"
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  const newImages = [...value];
                                  newImages.splice(index, 1);
                                  onChange(newImages);
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          // Keep existing images if any
                          const existingImages = Array.isArray(value) ? value.filter(img => typeof img === 'string') : [];
                          // Combine existing images with new files
                          onChange([...existingImages, ...files]);
                        }}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/owner/properties")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update Property" : "Create Property"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 