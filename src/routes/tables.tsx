import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {useEffect, useState} from "react";
import {Item} from "@/types/Item.tsx";
import {useAuth} from "@/context/AuthContext.tsx";
import api from "@/lib/api/api.ts";
import {Button} from "@/components/ui/button.tsx";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Pencil, Trash2 } from 'lucide-react';


export default function Tables() {
    const { selectedRestaurant, role } = useAuth();
    const [table, setTables] = useState<Table[]>([]);
    const [newTable, setNewTable] = useState<Table>({
        restaurantId: selectedRestaurant?._id,
    });
    const [editTable, setEditTable] = useState<Table>({
        restaurantId: selectedRestaurant?._id,
    });
    const [deleteTable, setDeleteTable] = useState<Table>({
        restaurantId: selectedRestaurant?._id,
    });
    const { toast } = useToast();

    useEffect(() => {
        api.get(`/tables/${selectedRestaurant?._id}`)
            .then(response => {
                setTables(response.data);
            })
            .catch(error => {
                console.error("Error fetching order types:", error);
            });
    }, [newTable, editTable, deleteTable]);

    const validateTable = (table) => {
        if (!table.no) {
            toast({
                title: "Invalid No",
                description: "Please enter a valid no for table."
            });
            return false;
        } else if (!table.seats) {
            toast({
                title: "Invalid Seats",
                description: "Please enter a valid seats no for table."
            });
            return false;
        } else {
            return true;
        }
    }

    const handleCreateTable = (e) => {
        e.preventDefault()
        // Validate the newItem
        if (validateTable(newTable)) {
            api.post('/tables/create', newTable )
                .then(response => {
                    console.log('Item Added:', response.data);
                    toast({
                        title: "Item Added",
                    });
                    setNewTable({...newTable, no: NaN, seats: NaN});
                })
                .catch(error => {
                    console.error('Error adding table:', error);
                });
        }
    }

    const handleEditTable = (e) => {
        e.preventDefault()
        // console.log("Editing item:", editItem);
        // Validate the newItem
        if (validateTable(editTable)) {
            api.post('/tables/edit', editTable )
                .then(response => {
                    // Handle successful response
                    console.log('Table Edited:', response.data);
                    toast({
                        title: "Table Edited",
                    });
                    setEditTable({...editTable, no: NaN, seats: NaN});
                })
                .catch(error => {
                    // Handle error
                    console.error('Error editing table:', error);
                });
        }
    }

    const handleDeleteTable = (e) => {
        e.preventDefault()
        if (!deleteTable._id) {
            toast({
                title: "Invalid Table",
                description: "Please select a valid table to delete."
            });
            return;
        }

        api.post('/tables/delete',  {tableId: deleteTable._id}  )
            .then(response => {
                // Handle successful response
                console.log('Table Deleted:', response.data);
                toast({
                    title: "Table Deleted",
                });
                setDeleteTable({...deleteTable, _id: "", no: NaN, seats: NaN});
            })
            .catch(error => {
                // Handle error
                console.error('Error deleting table:', error);
            });
    }

    let addTableContent = (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Table</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Table</DialogTitle>
                    <DialogDescription>
                        Add a new table to the restaurant.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4" >
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            No
                        </Label>
                        <Input id="name"
                               placeholder="1"
                               className="col-span-3"
                               value = {newTable.no}
                               onChange={(e) => setNewTable({...newTable, no: Number(e.target.value)})}/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="seat" className="text-right">
                            Seats
                        </Label>
                        <Input id="seats"
                               placeholder="4"
                               className="col-span-3"
                               onChange={(e) => setNewTable({...newTable, seats: Number(e.target.value)})}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreateTable}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    let editTableContent = (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><Pencil className={"w-4 p-0 m-0"}/></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Table</DialogTitle>
                    <DialogDescription>
                        Edit existing Table in menu.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="select" className="text-right">
                            Select Table
                        </Label>
                        <Select id="select"
                                onValueChange={(value) => {
                                    const selectedTable = table.find(item => item._id === value);
                                    if (selectedTable) {
                                        setEditTable(selectedTable);
                                    }
                                }}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Item"/>
                            </SelectTrigger>
                            <SelectContent>
                                {table.map((type) => (
                                    <SelectItem key={type._id} value={type._id}>
                                        {'Table No ' + type.no + ' with ' + type.seats + ' seats'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="no" className="text-right">
                            No
                        </Label>
                        <Input id="no"
                               value={editTable.no}
                               placeholder="2"
                               className="col-span-3"
                               onChange={(e) => setEditTable({...editTable, no: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="seats" className="text-right">
                            Seats
                        </Label>
                        <Input id="description"
                               value={editTable.seats}
                               placeholder="4"
                               className="col-span-3"
                               onChange={(e) => setEditTable({...editTable, seats: e.target.value})}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleEditTable}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

    let deleteTableContent = (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><Trash2 className={"w-4 p-0 m-0"}/></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Table</DialogTitle>
                    <DialogDescription>
                        Delete existing table in menu.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="select" className="text-right">
                            Select Table
                        </Label>
                        <Select id="select"
                                onValueChange={(value) => {
                                    const selectedTable = table.find(item => item._id === value);
                                    if (selectedTable) {
                                        setDeleteTable(selectedTable);
                                    }
                                }}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Table"/>
                            </SelectTrigger>
                            <SelectContent>
                                {table.map((type) => (
                                    <SelectItem key={type._id} value={type._id}>
                                        {'Table No ' + type.no + ' with ' + type.seats + ' seats'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleDeleteTable}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

    let content;
    if (role === 'owner') {
        content = (
            <div className={"flex flex-col m-4 p-4"}>
                <Toaster/>
                <div className={"flex justify-end gap-3"}>
                    {deleteTableContent}
                    {editTableContent}
                    {addTableContent}
                </div>
                <div className={"p-4"}>
                    <Table>
                        <TableCaption>A list of tables.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">No</TableHead>
                                <TableHead className="text-right">Seats</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {table.map(item => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">{item.no}</TableCell>
                                    <TableCell className="text-right">{item.seats}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    } else {
        content = (
            <div className={"flex flex-col justify-center items-center h-full"}>
                <p className={"text-gray-200 text-8xl p-4 mt-40"}>ツ</p>
                <p className={"text-gray-300 p-4"}>Content Restricted</p>
            </div>
        )
    }

    return (
        <div>{content}</div>
    );
}