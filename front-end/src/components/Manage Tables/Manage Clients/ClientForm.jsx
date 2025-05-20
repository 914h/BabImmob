import * as z from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../ui/form";
import {Input} from "../../ui/input";
import {Button} from "../../ui/button";
import {RadioGroup, RadioGroupItem} from '../../ui/radio-group'
import {Textarea} from "../../ui/textarea";
import { CalendarIcon, Loader, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import ParentApi from "../../../services/api/ParentApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

const formSchema = z.object({
  nom: z.string().min(1).max(50),
  prenom: z.string().min(1).max(50),
  email: z.string().email().min(2).max(50),
  password: z.union([z.string().min(8).max(30), z.string().length(0)]).optional(),
  phone: z.string().min(1).max(15),
  address: z.string().min(2).max(200),
  image: z.any().optional()
})

export default function ClientForm({handleSubmit,values}) {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    values?.image ? `/storage/${values.image}` : null
  );
  
  const form = useForm({
    resolver: zodResolver(formSchema),  
    defaultValues: {
      nom: values?.nom || '',
      prenom: values?.prenom || '',
      email: values?.email || '',
      password: '',
      phone: values?.phone || '',
      address: values?.address || ''
    }
  })
  
  const {setError, formState: {isSubmitting}, reset} = form
  const $isUpdate = values !== undefined
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      form.setValue('image', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async values => {
      const loadermsg = $isUpdate ? 'Updating in progress' : 'Adding in progress'
      const loader = toast.loading(loadermsg)

      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('nom', values.nom);
        formData.append('prenom', values.prenom);
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        formData.append('address', values.address);
        
        // Only add password if provided and not empty
        if (values.password && values.password.length > 0) {
          formData.append('password', values.password);
        }
        
        // Only append image if a new one was selected
        if (selectedImage) {
          formData.append('image', selectedImage);
        }

        console.log('Submitting form data:', Object.fromEntries(formData));
        const response = await handleSubmit(formData);
        console.log('Response received:', response);
        
        toast.dismiss(loader);
        
        if (response.status === 200 || response.status === 201) {
          toast.success(response.data.message || 'Client saved successfully');
          
          // Reset form after successful update
          if (!$isUpdate) {
            reset();
            setSelectedImage(null);
            setImagePreview(null);
            navigate('/admin/clients');
          }
        }
      } catch (error) {
        console.error('Form submission error:', error);
        toast.dismiss(loader);
        
        if (error.response?.data?.errors) {
          Object.entries(error.response.data.errors).forEach(([fieldName, errorMessages]) => {
            setError(fieldName, {
              message: errorMessages.join(', ')
            });
          });
        } else {
          toast.error(error.response?.data?.message || 'An error occurred');
        }
      }
  }

  return <>
    <Form {...form}>
      <form className={$isUpdate ? "space-y-3" : "space-y-1"} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="nom"
          render={({field}) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prenom"
          render={({field}) => (
            <FormItem>
              <FormLabel>Prenom</FormLabel>
              <FormControl>
                <Input placeholder="Prenom" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        {!$isUpdate && (
          <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type={'password'} placeholder="Password" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="phone"
          render={({field}) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone" {...field} />
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
                <Textarea placeholder="Address" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({field}) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button className={'mt-4'} type="submit">
          {isSubmitting && <Loader className={'mx-2 my-2 animate-spin'}/>} {' '}
          {$isUpdate ?'Update':'Create'}
        </Button>
      </form>
    </Form>
  </>
}