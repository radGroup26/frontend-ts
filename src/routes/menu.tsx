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


export default function Menu() {
    const { selectedRestaurant } = useAuth();
    const [items, setItems] = useState<Item[]>([]);
    const [newItem, setNewItem] = useState({
        restaurantId: selectedRestaurant?._id,
        name: "",
        description: "",
        option: "",
        price: NaN
    });
    const { toast } = useToast();

    useEffect(() => {
        api.get(`/items/${selectedRestaurant?._id}`)
            .then(response => {
                setItems(response.data);
            })
            .catch(error => {
                console.error("Error fetching order types:", error);
            });
    }, [newItem]);

    const handleCreateItem = (e) => {
        e.preventDefault()
        console.log("Creating item:", newItem);
        // Validate the newItem
        if (!newItem.name) {
            toast({
                title: "Invalid Name",
                description: "Please enter a valid name for item."
            });
            return;
        } else if (!newItem.description) {
            toast({
                title: "Invalid Description",
                description: "Please enter a valid description for item."
            });
            return;
        } else if (!newItem.option) {
            toast({
                title: "Invalid Option",
                description: "Please enter a valid option for item."
            });
            return;
        } else if (!newItem.price) {
            toast({
                title: "Invalid Price",
                description: "Please enter a valid price for item."
            });
            return;
        }

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

    return(
        <div className={"flex flex-col m-4 p-4"}>
            <Toaster />
            <div className={"flex justify-end"}>
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
                                       onChange={(e) => setNewItem({...newItem, name: e.target.value})}/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Description
                                </Label>
                                <Input id="description"
                                       placeholder="With mozzarella and tomato sause"
                                       className="col-span-3"
                                       onChange={(e) => setNewItem({...newItem, description: e.target.value})}/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="option" className="text-right">
                                    Option
                                </Label>
                                <Select id="option" onValueChange={(value) => setNewItem({...newItem, option: value})}>
                                    <SelectTrigger>
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
                            <Button onClick={handleCreateItem}>Add Item</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                {/*<Button variant="outline">Edit Item</Button>*/}
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
    );
}