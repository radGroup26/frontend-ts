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


export default function Menu() {
    const { selectedRestaurant, role } = useAuth();
    const [items, setItems] = useState<Item[]>([]);
    const [newItem, setNewItem] = useState<Item>({
        restaurantId: selectedRestaurant?._id,
        name: "",
        description: "",
        option: "",
        price: NaN,
        _id: ""
    });
    const [editItem, setEditItem] = useState<Item>({
        description: "",
        name: "",
        option: "",
        price: 0,
        restaurantId: selectedRestaurant?._id,
        _id: ""})
    const [deleteItem, setDeleteItem] = useState<Item>({
        description: "",
        name: "",
        option: "",
        price: 0,
        restaurantId: selectedRestaurant?._id,
        _id: ""});
    const { toast } = useToast();

    useEffect(() => {
        api.get(`/items/${selectedRestaurant?._id}`)
            .then(response => {
                setItems(response.data);
            })
            .catch(error => {
                console.error("Error fetching order types:", error);
            });
    }, [newItem, editItem, deleteItem]);

    const validateItem = (item) => {
        if (!item.name) {
            toast({
                title: "Invalid Name",
                description: "Please enter a valid name for item."
            });
            return false;
        } else if (!item.description) {
            toast({
                title: "Invalid Description",
                description: "Please enter a valid description for item."
            });
            return false;
        } else if (!item.option) {
            toast({
                title: "Invalid Option",
                description: "Please enter a valid option for item."
            });
            return false;
        } else if (!item.price) {
            toast({
                title: "Invalid Price",
                description: "Please enter a valid price for item."
            });
            return false;
        } else {
            return true;
        }
    }

    const handleCreateItem = (e) => {
        e.preventDefault()
        // console.log("Creating item:", newItem);
        // Validate the newItem
        if (validateItem(newItem)) {
            api.post('/items/create', newItem )
                .then(response => {
                    // Handle successful response
                    console.log('Item Added:', response.data);
                    toast({
                        title: "Item Added",
                    });
                    setNewItem({...newItem, name: "", description: "", option: "", price: NaN});
                })
                .catch(error => {
                    // Handle error
                    console.error('Error adding item:', error);
                });
        }
    }

    const handleEditItem = (e) => {
        e.preventDefault()
        // console.log("Editing item:", editItem);
        // Validate the newItem
        if (validateItem(editItem)) {
            api.post('/items/edit', editItem )
                .then(response => {
                    // Handle successful response
                    console.log('Item Edited:', response.data);
                    toast({
                        title: "Item Edited",
                    });
                    setEditItem({...editItem, name: "", description: "", option: "", price: NaN});
                })
                .catch(error => {
                    // Handle error
                    console.error('Error editing item:', error);
                });
        }
    }

    const handleDeleteItem = (e) => {
        e.preventDefault()
        if (!deleteItem._id) {
            toast({
                title: "Invalid Item",
                description: "Please select a valid item to delete."
            });
            return;
        }

        api.post('/items/delete',  {itemId: deleteItem._id}  )
            .then(response => {
                // Handle successful response
                console.log('Item Deleted:', response.data);
                toast({
                    title: "Item Delete",
                });
                setDeleteItem({...deleteItem, _id: "", name: "", description: "", option: "", price: NaN});
            })
            .catch(error => {
                // Handle error
                console.error('Error deleting item:', error);
            });
    }

    let addItemContent = (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Item</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Item</DialogTitle>
                    <DialogDescription>
                        Add a new item to the menu.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4" >
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name"
                               placeholder="Margarita"
                               className="col-span-3"
                               value = {newItem.name}
                               onChange={(e) => setNewItem({...newItem, name: e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input id="description"
                               placeholder="With mozzarella and tomato sause"
                               value = {newItem.description}
                               className="col-span-3"
                               onChange={(e) => setNewItem({...newItem, description: e.target.value})}/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="option" className="text-right">
                            Option
                        </Label>
                        <Select id="option" value = {newItem.option}
                                onValueChange={(value) => setNewItem({...newItem, option: value})}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Small">Small</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Large">Large</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price
                        </Label>
                        <Input id="price"
                               placeholder="1700"
                               className="col-span-3"
                               onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreateItem}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    let editItemContent = (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><Pencil className={"w-4 p-0 m-0"}/></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Item</DialogTitle>
                    <DialogDescription>
                        Edit existing item in menu.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="select" className="text-right">
                            Select Item
                        </Label>
                        <Select id="select"
                                onValueChange={(value) => {
                                    const selectedItem = items.find(item => item.name + ' ' + item.option === value);
                                    if (selectedItem) {
                                        setEditItem(selectedItem);
                                    }
                                }}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Item"/>
                            </SelectTrigger>
                            <SelectContent>
                                {items.map((type) => (
                                    <SelectItem key={type._id} value={type.name + ' ' + type.option}>
                                        {type.name + ' ' + type.option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name"
                               value={editItem.name || ' '}
                               className="col-span-3"
                               onChange={(e) => setEditItem({...editItem, name: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input id="description"
                               value={editItem.description || ' '}
                               className="col-span-3"
                               onChange={(e) => setEditItem({...editItem, description: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="option" className="text-right">
                            Option
                        </Label>
                        <Select id="option" value={editItem.option || ''}
                                onValueChange={(value) => setEditItem({...editItem, option: value})}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Option"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Small">Small</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Large">Large</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price
                        </Label>
                        <Input id="price"
                               value={editItem.price || 0}
                               className="col-span-3"
                               onChange={(e) => setEditItem({...editItem, price: Number(e.target.value)})}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleEditItem}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

    let deleteItemContent = (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><Trash2 className={"w-4 p-0 m-0"}/></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Item</DialogTitle>
                    <DialogDescription>
                        Delete existing item in menu.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="select" className="text-right">
                            Select Item
                        </Label>
                        <Select id="select"
                                onValueChange={(value) => {
                                    const selectedItem = items.find(item => item.name + ' ' + item.option === value);
                                    if (selectedItem) {
                                        setDeleteItem(selectedItem);
                                    }
                                }}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Item"/>
                            </SelectTrigger>
                            <SelectContent>
                                {items.map((type) => (
                                    <SelectItem key={type._id} value={type.name + ' ' + type.option}>
                                        {type.name + ' ' + type.option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleDeleteItem}>Confirm</Button>
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
                    {deleteItemContent}
                    {editItemContent}
                    {addItemContent}
                </div>
                <div className={"p-4"}>
                    <Table>
                        <TableCaption>A list of menu items.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Option</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map(item => (
                                <TableRow key={item._id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.option}</TableCell>
                                    <TableCell className="text-right">{item.price}</TableCell>
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