import { useEffect, useState } from "react"
import { DataTable } from "../../Data-table/DataTable"
import { DataTableColumnHeader } from "../../Data-table/DataTableColumnHeader .jsx"
import { Badge } from "../../ui/badge"
import { format } from "date-fns"
import { Printer } from "lucide-react"
import { Button } from "../../ui/button"

export default function OwnerVisitsList() {
    const [data, setData] = useState([])
    const [updatingId, setUpdatingId] = useState(null)
    const [loading, setLoading] = useState(true)

    // Fetch visits from API (now only hardcoded data)
    useEffect(() => {
        const hardcodedVisits = [
            {
                id: 2,
                client_id: 3,
                property_id: 6,
                agent_id: 1,
                visit_date: '2025-05-28 00:00:00',
                visit_time: '15:00',
                notes: null,
                note: null,
                status: 'pending',
                created_at: '2025-05-22 23:40:15',
                updated_at: '2025-05-22 23:40:15',
                property: 'Property 6',
                client: 'Proshak rolando',
                time: '15:00',
                date: '2025-05-28 00:00:00',
            },
            {
                id: 3,
                client_id: 3,
                property_id: 6,
                agent_id: 1,
                visit_date: '2025-05-30 00:00:00',
                visit_time: '14:00',
                notes: null,
                note: null,
                status: 'pending',
                created_at: '2025-05-22 23:48:37',
                updated_at: '2025-05-22 23:48:37',
                property: 'Property 6',
                client: 'Proshak rolando',
                time: '14:00',
                date: '2025-05-30 00:00:00',
            },
            {
                id: 4,
                client_id: 2,
                property_id: 13,
                agent_id: 1,
                visit_date: '2025-05-24 00:00:00',
                visit_time: '15:00',
                notes: null,
                note: null,
                status: 'pending',
                created_at: '2025-05-24 14:05:40',
                updated_at: '2025-05-24 14:05:40',
                property: 'Property 13',
                client: 'Mr houssam',
                time: '15:00',
                date: '2025-05-24 00:00:00',
            },
            {
                id: 5,
                client_id: 2,
                property_id: 13,
                agent_id: 1,
                visit_date: '2025-06-18 00:00:00',
                visit_time: '15:00',
                notes: 'dms fsd',
                note: null,
                status: 'pending',
                created_at: '2025-06-18 17:44:36',
                updated_at: '2025-06-18 17:44:36',
                property: 'Property 13',
                client: 'Mr houssam',
                time: '15:00',
                date: '2025-06-18 00:00:00',
            },
            {
                id: 6,
                client_id: 2,
                property_id: 14,
                agent_id: 1,
                visit_date: '2025-06-29 00:00:00',
                visit_time: '11:00',
                notes: 'salam',
                note: null,
                status: 'pending',
                created_at: '2025-06-18 18:28:13',
                updated_at: '2025-06-19 15:14:42',
                property: 'Property 14',
                client: 'Mr houssam',
                time: '11:00',
                date: '2025-06-29 00:00:00',
            },
            {
                id: 7,
                client_id: 2,
                property_id: 14,
                agent_id: 1,
                visit_date: '2025-06-23 00:00:00',
                visit_time: '11:00',
                notes: 'sda',
                note: null,
                status: 'pending',
                created_at: '2025-06-18 18:34:21',
                updated_at: '2025-06-18 18:34:21',
                property: 'Property 14',
                client: 'Mr houssam',
                time: '11:00',
                date: '2025-06-23 00:00:00',
            },
        ];
        setData(hardcodedVisits);
        setLoading(false);
    }, [])

    // Handler to update status (now only updates local state)
    const handleStatusChange = async (visitId, newStatus) => {
        setUpdatingId(visitId)
        setTimeout(() => {
            setData(prev => prev.map(v => v.id === visitId ? { ...v, status: newStatus } : v))
            setUpdatingId(null)
        }, 500)
    }

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
                const visitId = row.getValue("id")
                return (
                    <div className="flex items-center gap-2">
                        <Badge variant={
                            status === 'confirmed' ? 'success' :
                            status === 'pending' ? 'warning' :
                            'destructive'
                        }>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                        <select
                            className="ml-2 border rounded px-1 py-0.5 text-xs"
                            value={status}
                            disabled={updatingId === visitId}
                            onChange={e => handleStatusChange(visitId, e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
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