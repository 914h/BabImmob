import { useEffect, useState } from "react"
import { DataTable } from "../../Data-table/DataTable"
import { DataTableColumnHeader } from "../../Data-table/DataTableColumnHeader .jsx"
import { Badge } from "../../ui/badge"
import { format } from "date-fns"

export default function OwnerVisitsList() {
    const [data, setData] = useState([])

    const TableColumns = [
        {
            accessorKey: "id",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="#ID" />
            },
        },
        {
            accessorKey: "property",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Property" />
            },
            cell: ({ row }) => {
                const property = row.getValue("property")
                return <div className="font-medium">{property}</div>
            }
        },
        {
            accessorKey: "client",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Client" />
            },
            cell: ({ row }) => {
                const client = row.getValue("client")
                return <div className="font-medium">{client}</div>
            }
        },
        {
            accessorKey: "date",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Visit Date" />
            },
            cell: ({ row }) => {
                const date = row.getValue("date")
                return <div>{format(new Date(date), 'PPP')}</div>
            }
        },
        {
            accessorKey: "time",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Time" />
            },
            cell: ({ row }) => {
                const time = row.getValue("time")
                return <div>{time}</div>
            }
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Status" />
            },
            cell: ({ row }) => {
                const status = row.getValue("status")
                return (
                    <Badge variant={
                        status === 'confirmed' ? 'success' :
                        status === 'pending' ? 'warning' :
                        'destructive'
                    }>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                )
            }
        }
    ]

    useEffect(() => {
        // TODO: Replace with actual API call
        // Mock data for now
        const mockData = [
            {
                id: 1,
                property: "Luxury Apartment - Downtown",
                client: "John Doe",
                date: "2024-03-20",
                time: "14:00",
                status: "confirmed"
            },
            {
                id: 2,
                property: "Modern Villa - Suburbs",
                client: "Jane Smith",
                date: "2024-03-22",
                time: "10:30",
                status: "pending"
            },
            {
                id: 3,
                property: "Studio Apartment - City Center",
                client: "Mike Johnson",
                date: "2024-03-25",
                time: "16:00",
                status: "cancelled"
            }
        ]
        setData(mockData)
    }, [])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Upcoming Visits</h2>
            </div>
            <DataTable columns={TableColumns} data={data} />
        </div>
    )
} 