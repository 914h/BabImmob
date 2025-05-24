import * as z from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../ui/form";
import {Input} from "../../ui/input";
import {Button} from "../../ui/button";
import {Textarea} from "../../ui/textarea";
import { Loader } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import PropertyApi from "../../../services/api/PropertyApi";
import { useEffect, useState } from "react";

const formSchema = z.object({
  type: z.enum(['apartment', 'house', 'villa', 'land', 'commercial'], {
    required_error: "Please select a property type",
  }),
  title: z.string().min(2, "Title must be at least 2 characters").max(255, "Title must be less than 255 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters").max(255, "Address must be less than 255 characters"),
  city: z.string().min(2, "City must be at least 2 characters").max(255, "City must be less than 255 characters"),
  surface: z.string().transform(val => parseFloat(val)),
  rooms: z.string().transform(val => parseInt(val)),
  price: z.string().transform(val => parseFloat(val)),
  status: z.enum(['available', 'rented', 'sold', 'pending'], {
    required_error: "Please select a status",
  }),
  images: z.any().optional()
})

export default function PropertyForm({handleSubmit: propHandleSubmit, values}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [existingImages, setExistingImages] = useState([]);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'apartment',
      title: '',
      description: '',
      address: '',
      city: '',
      surface: '',
      rooms: '',
      price: '',
      status: 'available',
      images: []
    }
  });
  
  useEffect(() => {
    if (isEdit) {
      const fetchProperty = async () => {
        try {
          const response = await PropertyApi.get(id);
          const propertyData = response.data?.data || response.data;
          setProperty(propertyData);
          setExistingImages(propertyData.images || []);
          
          form.reset({
            type: propertyData.type,
            title: propertyData.title,
            description: propertyData.description,
            address: propertyData.address,
            city: propertyData.city,
            surface: propertyData.surface?.toString(),
            rooms: propertyData.rooms?.toString(),
            price: propertyData.price?.toString(),
            status: propertyData.status,
            images: propertyData.images || []
          });
        } catch (error) {
          console.error("Error fetching property:", error);
          toast.error("Failed to fetch property details");
          navigate("/owner/properties");
        } finally {
          setLoading(false);
        }
      };
      
      fetchProperty();
    }
  }, [id, isEdit, navigate, form]);
  
  const {setError, formState: {isSubmitting}, reset} = form
  const $isUpdate = values !== undefined || isEdit
  
  const onSubmit = async (values) => {
    const loadermsg = $isUpdate ? 'Updating property...' : 'Adding property...'
    const loader = toast.loading(loadermsg)

    try {
      // Create FormData object for file upload
      const formData = new FormData();
      
      // Add all non-file fields
      Object.keys(values).forEach(key => {
        if (key !== 'images') {
          formData.append(key, values[key]);
        }
      });

      // Handle images
      if (values.images) {
        if (Array.isArray(values.images)) {
          values.images.forEach((image, index) => {
            if (image instanceof File) {
              formData.append(`images[${index}]`, image);
            } else if (typeof image === 'string') {
              formData.append(`existing_images[${index}]`, image);
            }
          });
        }
      }

      let response;
      if (propHandleSubmit) {
        response = await propHandleSubmit(formData);
      } else {
        if (isEdit) {
          response = await PropertyApi.update(id, formData);
        } else {
          response = await PropertyApi.create(formData);
        }
      }

      if (response.status === 200 || response.status === 201) {
        toast.dismiss(loader)
        toast.success(response.data.message || 'Property saved successfully')
        reset()
        navigate('/owner/properties')
      }
    } catch (error) {
      toast.dismiss(loader)
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([fieldName, errorMessages]) => {
          setError(fieldName, {
            message: errorMessages.join(', ')
          })
        })
      } else {
        toast.error('An error occurred')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="type"
          render={({field}) => (
            <FormItem>
              <FormLabel>Property Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({field}) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Property title" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({field}) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Property description" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({field}) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Property address" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({field}) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="surface"
            render={({field}) => (
              <FormItem>
                <FormLabel>Surface (m²)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Surface area" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rooms"
            render={({field}) => (
              <FormItem>
                <FormLabel>Rooms</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Number of rooms" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="price"
          render={({field}) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Property price" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({field}) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({field: { value, onChange, ...field }}) => (
            <FormItem>
              <FormLabel>Property Images</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {existingImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {existingImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`Property ${index + 1}`} 
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = existingImages.filter((_, i) => i !== index);
                              setExistingImages(newImages);
                              onChange(newImages);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Input 
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const newImages = [...(existingImages || []), ...files];
                      onChange(newImages);
                    }}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          {$isUpdate ? 'Update Property' : 'Add Property'}
        </Button>
      </form>
    </Form>
  );
}