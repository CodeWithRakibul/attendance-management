"use client";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "./ui/button";
import { IconPlus } from "@tabler/icons-react";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

export default function TableOverview() {
    return (
        <Tabs
            defaultValue="attendances"
            className="w-full flex-col justify-start gap-6"
        >
            <div className="flex items-center justify-between">
                <Label htmlFor="view-selector" className="sr-only">
                    View
                </Label>
                <Select defaultValue="attendances">
                    <SelectTrigger
                        className="flex w-fit @4xl/main:hidden"
                        size="sm"
                        id="view-selector"
                    >
                        <SelectValue placeholder="Select a view" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="attendances">Attendances</SelectItem>
                        <SelectItem value="employees">Employees</SelectItem>
                        <SelectItem value="shifts">Shifts</SelectItem>
                    </SelectContent>
                </Select>
                <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                    <TabsTrigger value="attendances">Attendances</TabsTrigger>
                    <TabsTrigger value="employees">
                        Employees <Badge variant="secondary">3</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="shifts">
                        Shifts <Badge variant="secondary">2</Badge>
                    </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <IconPlus />
                        <span className="hidden lg:inline">Add Section</span>
                    </Button>
                </div>
            </div>
            <TabsContent
                value="attendances"
                className="relative flex flex-col gap-4 overflow-auto"
            >
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent
                value="employees"
                className="flex flex-col px-4 lg:px-6"
            >
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent value="shifts" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
        </Tabs>
    )
}
