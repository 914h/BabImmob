import { useEffect, useState, forwardRef, useImperativeHandle } from "react"
import { DataTable } from "../../Data-table/DataTable"
import { Button } from "../../ui/button"
import { Pencil, Trash } from "lucide-react"
import AgentApi from "../../../services/api/AgentApi"
import { toast } from "sonner"

const AgentsList = forwardRef((props, ref) => {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  const refreshAgents = () => {
    setLoading(true)
    AgentApi.all().then(({ data }) => {
      setAgents(data.data)
      setLoading(false)
    })
  }

  useImperativeHandle(ref, () => ({
    refreshAgents
  }))

  const columns = [
        {
          accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "img",
      header: "Profile",
      cell: ({ row }) => {
        const img = row.getValue("img")
        return img ? (
          <img 
            src={`http://localhost:8000/storage/${img}`} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No img</span>
          </div>
        )
          },
        },
        {
          accessorKey: "prenom",
      header: "Prenom",
        },
        {
      accessorKey: "name",
      header: "Name",
        },
        {
          accessorKey: "email",
      header: "Email",
        },
        {
      accessorKey: "updated_at",
          header: "Last Update",
      cell: ({ row }) => {
        const date = new Date(row.getValue("updated_at"))
        return date.toLocaleDateString()
          },
        },
        {
      id: "actions",
      cell: ({ row }) => {
        const agent = row.original
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // Handle update
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const loader = toast.loading("Deleting in progress")
                AgentApi.delete(agent.id).then(({ status, data }) => {
                  if (status === 200) {
                    toast.dismiss(loader)
                    toast.success(data.message)
                    refreshAgents()
                  }
                })
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
                </div>
              )
            },
          },
      ]

      useEffect(() => {
    refreshAgents()
      }, [])

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={agents} loading={loading} />
    </div>
  )
})

export default AgentsList