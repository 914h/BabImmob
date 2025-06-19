import { useEffect, useState } from "react"
import { DataTable } from "../../Data-table/DataTable"
import { DataTableColumnHeader } from "../../Data-table/DataTableColumnHeader .jsx"
import { Badge } from "../../ui/badge"
import { format } from "date-fns"
import { Printer } from "lucide-react"
import { Button } from "../../ui/button"

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
        },
        {
            id: "actions",
            header: () => <span>Print</span>,
            cell: ({ row }) => (
                <Button variant="outline" size="icon" onClick={() => printVisit(row.original)} title="Print this visit">
                    <Printer className="h-4 w-4" />
                </Button>
            )
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

function printVisit(visit) {
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write(`
        <html>
            <head>
                <title>BabImmob | Visit Details</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 2rem; }
                    h1 { color: #2563eb; }
                    .label { font-weight: bold; }
                    .section { margin-bottom: 1rem; }
                </style>
            </head>
            <body>
                <h1>BabImmob | Visit Details</h1>
                <div class="section"><span class="label">Property:</span> ${visit.property}</div>
                <div class="section"><span class="label">Client:</span> ${visit.client}</div>
                <div class="section"><span class="label">Date:</span> ${visit.date ? new Date(visit.date).toLocaleDateString() : ''}</div>
                <div class="section"><span class="label">Time:</span> ${visit.time || 'N/A'}</div>
                <div class="section"><span class="label">Status:</span> ${visit.status}</div>
                <div class="section"><span class="label">Notes:</span> ${visit.notes || 'No notes'}</div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
} 