import { useEffect, useState } from "react"
import { DataTable } from "../../Data-table/DataTable"
import {Button} from "../../ui/button";
import {Trash2Icon} from "lucide-react";
import { DataTableColumnHeader } from "../../Data-table/DataTableColumnHeader ";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
  } from "../../ui/alert-dialog";
  import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "../../ui/sheet"
import { toast } from "sonner";
import ClientApi from "../../../services/api/ClientApi";
import ClientForm from "./ClientForm";

export default function ClientsList(){
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await ClientApi.all();
            setClients(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading clients...</div>;
    if (error) return <div>Error: {error}</div>;

    const TableColumns = [
        {
          accessorKey: "id",
          header: ({ column }) => {
            return <DataTableColumnHeader  column={column} title="#ID" />
          },
        },
        {
          accessorKey: "image",
          header: "Image",
          cell: ({ row }) => {
            const image = row.getValue("image")
            return image ? (
              <div className="flex justify-center">
                <img 
                  src={`/storage/${image}`}
                  alt="Client" 
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xs">No Image</span>
              </div>
            )
          },
        },
        {
          accessorKey: "nom",
          header: ({ column }) => {
            return <DataTableColumnHeader  column={column} title="Nom" />
          },
        },
        {
          accessorKey: "prenom",
          header: ({ column }) => {
            return <DataTableColumnHeader  column={column} title="Prenom" />
          },
        },
        {
          accessorKey: "email",
          header: ({ column }) => {
            return <DataTableColumnHeader  column={column} title="Email" />
          },
        },
        {
          accessorKey: "phone",
          header: ({ column }) => {
            return <DataTableColumnHeader  column={column} title="Phone" />
          },
        },
        {
          accessorKey: "address",
          header: ({ column }) => {
            return <DataTableColumnHeader  column={column} title="Address" />
          },
        },
        {
          accessorKey: "formatted_updated_at",
          header: "Last Update",
          cell: ({row}) => {
            const formatted_updated_at = row.getValue("formatted_updated_at")
            return <div className="text font-medium">{formatted_updated_at}</div>
          },
        },
        {
          accessorKey: "Actions",
            cell: ({row}) => {
              const {id , nom , prenom} = row.original
              const [OpenDialogue, setOpenDialogue] = useState(false)
              return (<>
              <div className={'flex gap-x-1'}>
              <Sheet  open={OpenDialogue} onOpenChange={setOpenDialogue}>
                <SheetTrigger>
                <Button size={'sm'} className="mx-2">Update</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Update Client {nom} {prenom} </SheetTitle>
                    <SheetDescription>
                    Make changes to your Client here. Click save when you're done.
                        <ClientForm 
                          values={row.original} 
                          handleSubmit={async (formData) => {
                            console.log('ClientList handleSubmit called with:', formData);
                            
                            try {
                              const response = await ClientApi.update(id, formData);
                              console.log('Update successful:', response);
                              
                              // Update the client in the local state
                              const updatedClient = response.data.client;
                              updatedClient.formatted_updated_at = response.data.client.formatted_updated_at;
                              
                              setClients(prevClients => 
                                prevClients.map(client => 
                                  client.id === id ? updatedClient : client
                                )
                              );
                              
                              // Close the sheet
                              setOpenDialogue(false);
                              
                              // Show success notification
                              toast.success('Client updated successfully');
                              
                              return response;
                            } catch (error) {
                              console.error('Update failed:', error);
                              toast.error('Failed to update client: ' + (error.response?.data?.message || error.message));
                              throw error;
                            }
                          }}
                        />
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size={'sm'} >Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure to delete
                        <span className={'font-bold'}> {nom} {prenom}</span> ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        client and remove the data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={ async () => {
                        const deletingLoader = toast.loading('Deleting in progress.')
                        const {data: deletedClient, status} = await ClientApi.delete(id)
                        toast.dismiss(deletingLoader)
                        if (status === 200 ){
                            toast.success('Client deleted',{
                                description: `Client deleted successfully ${deletedClient.data.nom} ${deletedClient.data.prenom}`,
                                icon: <Trash2Icon/>
                              })
                              setClients(clients.filter((client) => client.id !== id))
                        }else {
                            toast.error('Error deleting client');
                          }
                      }} >Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                </div>
                </>
              )
            },
          },
      ]

    return <>
        <DataTable columns={TableColumns} data={clients}/>
    </>
}