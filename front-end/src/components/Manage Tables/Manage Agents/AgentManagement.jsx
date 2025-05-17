import {Button} from "../../ui/button";
import {Plus} from "lucide-react";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "../../ui/sheet";
import {useState, useRef} from "react";
import AgentForm from "./AgentForm";
import AgentApi from "../../../services/api/AgentApi";
import AgentsList from "./AgentList";

export default function AgentsManagement() {
  const [open, setOpen] = useState(false);
  const listRef = useRef();

  const handleRefresh = () => {
    if (listRef.current) {
      listRef.current.refreshAgents();
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Agents</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Agent</SheetTitle>
              <SheetDescription>
                Fill in the form below to add a new agent.
                <AgentForm
                  handleSubmit={(values) => {
                    const promise = AgentApi.create(values);
                    promise.then(() => {
                      setOpen(false);
                    });
                    return promise;
                  }}
                  onSuccess={handleRefresh}
                />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <AgentsList ref={listRef} />
    </div>
  );
}
