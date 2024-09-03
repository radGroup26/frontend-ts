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
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {useEffect, useState} from "react";
import {Item} from "@/types/Item.tsx";
import {useAuth} from "@/context/AuthContext.tsx";
import api from "@/lib/api/api.ts";
import {Button} from "@/components/ui/button.tsx";


export default function Menu() {
    const { selectedRestaurant } = useAuth();
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        api.get(`/items/${selectedRestaurant?._id}`)
            .then(response => {
                setItems(response.data);
            })
            .catch(error => {
                console.error("Error fetching order types:", error);
            });
    }, []);

    return(
        <div className={"flex flex-col m-4 p-4"}>
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
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input id="name" value="Pedro Duarte" className="col-span-3"/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Description
                                </Label>
                                <Input id="description" value="@peduarte" className="col-span-3"/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="option" className="text-right">
                                    Option
                                </Label>
                                <Input id="option" value="@peduarte" className="col-span-3"/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">
                                    Price
                                </Label>
                                <Input id="price" value="@peduarte" className="col-span-3"/>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Add Item</Button>
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