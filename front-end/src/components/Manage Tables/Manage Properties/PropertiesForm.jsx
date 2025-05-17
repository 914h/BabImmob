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

const formSchema = z.object({
  type: z.enum(['apartment', 'house', 'villa', 'land', 'commercial']),
  title: z.string().min(2).max(255),
  description: z.string().min(10),
  address: z.string().min(5).max(255),
  city: z.string().min(2).max(255),
  surface: z.string().transform(val => parseFloat(val)),
  rooms: z.string().transform(val => parseInt(val)),
  price: z.string().transform(val => parseFloat(val)),
  status: z.enum(['available', 'rented', 'sold', 'pending']),
  images: z.array(z.instanceof(File)).optional()
})

export default function PropertyForm({handleSubmit: propHandleSubmit, values}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const form = useForm({
    resolver: zodResolver(formSchema),  
    defaultValues: values || {
      type: 'apartment',
      status: 'available'
    }
  })
  
  const {setError, formState: {isSubmitting}, reset} = form
  const $isUpdate = values !== undefined || isEdit
  
  const onSubmit = async values => {
      const loadermsg = $isUpdate ? 'Updating property...' : 'Adding property...'
      const loader = toast.loading(loadermsg)

      try {
        let response;
        if (propHandleSubmit) {
          response = await propHandleSubmit(values);
        } else {
          if (isEdit) {
            response = await PropertyApi.update(id, values);
          } else {
            response = await PropertyApi.create(values);
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
                <Input 
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    onChange(files);
                  }}
                  {...field}
                />
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