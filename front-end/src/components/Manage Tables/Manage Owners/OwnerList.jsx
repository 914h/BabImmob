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
import OwnerApi from "../../../services/api/OwnerApi";
import OwnerForm from "./OwnerForm";
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';

export default function OwnersList(){

    const TableColumns = [
        {
          accessorKey: "id",
          header: ({ column }) => {
            return <DataTableColumnHeader  column={column} title="#ID" />
          },
        },
        {
          accessorKey: "img",
          header: "Image",
          cell: ({ row }) => {
            const img = row.getValue("img");
            const name = row.getValue("name");
            const prenom = row.getValue("prenom");
            const id = row.getValue("id");
            const randomAvatar = getRandomPersonAvatar(id);
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const imageUrl = img ? `${apiUrl}/storage/${img}` : randomAvatar;
            return (
              <div className="flex justify-center">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={imageUrl} alt={name} />
                  <AvatarFallback>{(prenom?.[0] || '') + (name?.[0] || '')}</AvatarFallback>
                </Avatar>
              </div>
            );
          },
        },
        {
          accessorKey: "name",
          header: ({ column }) => {
            return <DataTableColumnHeader  column={column} title="Name" />
          },
        },
        {
          accessorKey: "email",
          header: ({ column }) => {
            return <DataTableColumnHeader  column={column} title="Email" />
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
              const {id , prenom , name} = row.original
              const [OpenDialogue, setOpenDialogue] = useState(false)
              return (<>
              <div className={'flex gap-x-1'}>
              <Sheet  open={OpenDialogue} onOpenChange={setOpenDialogue}>
                <SheetTrigger>
                <Button size={'sm'} className="mx-2">Update</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Update Owner {prenom} {name} </SheetTitle>
                    <SheetDescription>
                    Make changes to your Owner here. Click save when you're done.
                        <OwnerForm values={row.original} handleSubmit={ (values) => {
                          const promise = OwnerApi.update(id, values)
                          promise.then((response) => {
                            const {owner} = response.data
                            const elements = data.map((item) => {
                              if (item.id === id){
                                return {
                                  ...owner,
                                  formatted_updated_at: new Date(owner.updated_at).toLocaleString()
                                }
                              }
                              return item
                            })
                            setdata(elements)
                            setOpenDialogue(false)
                            toast.success('Owner updated successfully')
                          }).catch(error => {
                            console.error('Error updating owner:', error);
                            toast.error('Failed to update owner');
                          })
                          return promise 
                        }}/>
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
                        <span className={'font-bold'}> {prenom} {name}</span> ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        owner and remove the data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={ async () => {
                        try {
                          const deletingLoader = toast.loading('Deleting in progress...')
                          const response = await OwnerApi.delete(id)
                          toast.dismiss(deletingLoader)
                          
                          if (response.status === 200) {
                            toast.success('Owner deleted successfully', {
                              description: `Owner ${prenom} ${name} has been deleted`,
                              icon: <Trash2Icon/>
                            })
                            setdata(data.filter((owner) => owner.id !== id))
                          } else {
                            toast.error('Failed to delete owner')
                          }
                        } catch (error) {
                          console.error('Error deleting owner:', error);
                          toast.error('Failed to delete owner');
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

    const [data, setdata] = useState([])
    useEffect(() => {
        console.log('Fetching owners...');
        OwnerApi.all().then((response) => {
            console.log('API Response:', response);
            if (response.data && response.data.data) {
                console.log('Setting data:', response.data.data);
                setdata(response.data.data);
            } else {
                console.error('Invalid response format:', response);
            }
        }).catch(error => {
            console.error('Error fetching owners:', error);
        });
    }, [])

    // Function to get a random people avatar from randomuser.me
    function getRandomPersonAvatar(id) {
      const gender = id % 2 === 0 ? 'men' : 'women';
      // randomuser.me has images from 0 to 99
      const avatarId = id % 100;
      return `https://randomuser.me/api/portraits/${gender}/${avatarId}.jpg`;
    }

    // Add a placeholder column to make the table look longer
    const extendedColumns = [
      ...TableColumns,
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          // Just mock some status for demo
          const id = row.getValue('id');
          const statuses = ['Active', 'Pending', 'Inactive', 'Verified'];
          return <span className="px-2 py-1 rounded bg-muted text-xs">{statuses[id % statuses.length]}</span>;
        },
      },
      {
        accessorKey: 'notes',
        header: 'Notes',
        cell: ({ row }) => {
          return <span className="text-xs text-muted-foreground">-</span>;
        },
      },
    ];
    return (
      <div className="w-full min-w-full">
        <DataTable columns={extendedColumns} data={data} className="min-w-full" />
      </div>
    );
}