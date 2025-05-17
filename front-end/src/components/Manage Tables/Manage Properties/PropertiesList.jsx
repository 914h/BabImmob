import { useEffect, useState } from "react"
import { DataTable } from "../../Data-table/DataTable"
import {Button} from "../../ui/button";
import {Trash2Icon, Edit2Icon, Plus, Eye} from "lucide-react";
import { DataTableColumnHeader } from "../../Data-table/DataTableColumnHeader "
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
import PropertyApi from "../../../services/api/PropertyApi";
import PropertyForm from "./PropertiesForm";
import { useNavigate } from "react-router-dom";

export default function PropertiesList() {
    const [properties, setProperties] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [propertyToDelete, setPropertyToDelete] = useState(null)
    const navigate = useNavigate()

    const fetchProperties = async () => {
        try {
            setLoading(true)
            const response = await PropertyApi.getMyProperties()
            // Check if response.data is an array or has a data property
            const propertiesData = Array.isArray(response.data) ? response.data : response.data.data
            setProperties(propertiesData)
        } catch (error) {
            console.error("Error fetching properties:", error)
            toast.error("Failed to fetch properties")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProperties()
    }, [])

    const handleCreate = () => {
        navigate("/owner/properties/create")
    }

    const handleEdit = (property) => {
        navigate(`/owner/properties/${property.id}/edit`)
    }

    const handleView = (property) => {
        navigate(`/owner/properties/${property.id}`)
    }

    const handleDelete = async (property) => {
        setPropertyToDelete(property)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        try {
            await PropertyApi.delete(propertyToDelete.id)
            toast.success("Property deleted successfully")
            fetchProperties()
        } catch (error) {
            console.error("Error deleting property:", error)
            toast.error("Failed to delete property")
        } finally {
            setDeleteDialogOpen(false)
            setPropertyToDelete(null)
        }
    }

    const TableColumns = [
        {
            accessorKey: "id",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="#ID" />
            },
        },
        {
            accessorKey: "type",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Type" />
            },
            cell: ({ row }) => {
                const type = row.getValue("type")
                return <div className="capitalize">{type}</div>
            }
        },
        {
            accessorKey: "title",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Title" />
            },
        },
        {
            accessorKey: "city",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="City" />
            },
        },
        {
            accessorKey: "price",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Price" />
            },
            cell: ({ row }) => {
                const price = row.getValue("price")
                return <div>${price.toLocaleString()}</div>
            }
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Status" />
            },
            cell: ({ row }) => {
                const status = row.getValue("status")
                return <div className="capitalize">{status}</div>
            }
        },
        {
            id: "actions",
            cell: ({row}) => {
                const property = row.original
                return (
                    <div className="flex gap-x-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(property)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(property)}
                        >
                            <Edit2Icon className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(property)}
                        >
                            <Trash2Icon className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        },
    ]

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Properties</h2>
                <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                </Button>
            </div>

            <DataTable columns={TableColumns} data={properties} loading={loading} />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            property "{propertyToDelete?.title}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}