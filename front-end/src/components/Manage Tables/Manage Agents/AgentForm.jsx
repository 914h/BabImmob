import * as z from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../ui/form";
import {Input} from "../../ui/input";
import {Button} from "../../ui/button";
import { Loader } from "lucide-react";
import { ADMIN_MANAGE_AGENTS_ROUTE } from "../../../router";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const formSchema = z.object({
  prenom: z.string().max(50),
  name: z.string().max(50),
  email: z.string().email().min(2).max(50),
  password: z.string().min(8).max(30),
  img: z.instanceof(File).optional()
})

export default function AgentForm({handleSubmit, values, onSuccess}) {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),  
    defaultValues: values || {}
  })
  
  const {setError, formState: {isSubmitting}, reset} = form
  const $isUpdate = values !== undefined
  
  const onSubmit = async values => {
      const loadermsg = $isUpdate?'Updating in progress':'Adding in progress'
      const loader = toast.loading(loadermsg)

      try {
        const response = await handleSubmit(values);
        if (response.status === 200 || response.status === 201) {
          toast.dismiss(loader);
          toast.success(response.data.message);
          reset();
          if (onSuccess) {
            onSuccess();
          }
          navigate(ADMIN_MANAGE_AGENTS_ROUTE);
        }
      } catch (error) {
        toast.dismiss(loader);
        if (error.response?.data?.errors) {
          Object.entries(error.response.data.errors).forEach(([fieldName, errorMessages]) => {
            setError(fieldName, {
              message: Array.isArray(errorMessages) ? errorMessages.join(', ') : errorMessages
            });
          });
        } else {
          toast.error('An error occurred while processing your request');
        }
      }
  }

  return <>
    <Form {...form}>
      <form className={$isUpdate ? "space-y-3" : "space-y-1"} onSubmit={form.handleSubmit(onSubmit)}>
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
          name="name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
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
        <FormField
          control={form.control}
          name="img"
          render={({field: { value, onChange, ...field }}) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <Input 
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                    }
                  }}
                  {...field}
                />
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