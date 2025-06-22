import { useEffect, useState, forwardRef, useImperativeHandle } from "react"
import { DataTable } from "../../Data-table/DataTable"
import { Button } from "../../ui/button"
import { Pencil, Trash } from "lucide-react"
import AgentApi from "../../../services/api/AgentApi"
import { toast } from "sonner"
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';

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

  // Function to get a random people avatar from randomuser.me
  function getRandomPersonAvatar(id) {
    const gender = id % 2 === 0 ? 'men' : 'women';
    // randomuser.me has images from 0 to 99
    const avatarId = id % 100;
    return `https://randomuser.me/api/portraits/${gender}/${avatarId}.jpg`;
  }

  const columns = [
        {
          accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "img",
      header: "Profile",
      cell: ({ row }) => {
        const img = row.getValue("img");
        const name = row.getValue("name");
        const prenom = row.getValue("prenom");
        const id = row.getValue("id");
        const randomAvatar = getRandomPersonAvatar(id);
        const imageUrl = img ? `http://localhost:8000/storage/${img}` : randomAvatar;
        return (
          <Avatar className="w-10 h-10">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback>{(prenom?.[0] || '') + (name?.[0] || '')}</AvatarFallback>
          </Avatar>
        );
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