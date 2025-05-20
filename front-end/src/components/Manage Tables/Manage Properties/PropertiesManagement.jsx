import {Tabs, TabsContent, TabsList, TabsTrigger} from "../../ui/tabs";
import {Separator} from "../../ui/separator";
import {ScrollArea, ScrollBar} from "../../ui/scroll-area";
import PropertiesList from "./PropertiesList";
import PropertyApi from "../../../services/api/PropertyApi";
import PropertyForm from "./PropertiesForm";

export default function PropertiesManagement() {
    return (
<div className="relative overflow-x-auto">
      <div className="hidden md:block">
        <div className="">
          <div className="bg-background">
            <div className="grid">
              <div className="col-span-3 lg:col-span-4">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="item_list" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                                                <TabsTrigger value="item_list" className="relative">My Properties</TabsTrigger>
                                                <TabsTrigger value="add_item">Add New Property</TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent
                      value="item_list"
                      className="border-none p-0 outline-none"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                                                        My Properties
                          </h2>
                                                    <PropertiesList/>
                        </div>
                      </div>
                      <Separator className="my-4"/>
                    </TabsContent>
                                        <TabsContent value="add_item">
                      <div className="space-y-1">
                                                <h2 className="text-2xl font-semibold tracking-tight">
                                                    Add New Property
                                                </h2>
                                                <PropertyForm handleSubmit={(values) => PropertyApi.create(values)}/>
                      </div>
                      <Separator className="my-4"/>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
    );
}
