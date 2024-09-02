import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import axios from "axios";

interface DiningTableProps {
    tableId: string;
    tableSeats: string;
}

export default function DiningTable({ tableId, tableSeats }: DiningTableProps) {
    const [orders, setOrders] = useState([]);
    const [orderTypes, setOrderTypes] = useState([]);
    const [newOrder, setNewOrder] = useState({ order: "", status: "" });

    useEffect(() => {
        // // Fetch orders from the backend
        // axios.get("http://localhost:3000/orders")
        //     .then(response => {
        //         setOrders(response.data);
        //     })
        //     .catch(error => {
        //         console.error("Error fetching orders:", error);
        //     });
        // // Fetch available order types from the backend
        // axios.get("http://localhost:3000/order-types")
        //     .then(response => {
        //         setOrderTypes(response.data);
        //     })
        //     .catch(error => {
        //         console.error("Error fetching order types:", error);
        //     });

        // Sample order types array
        const sampleOrderTypes = [
            { id: "1", name: "Teriyaki Pizza Large" },
            { id: "2", name: "Spicy Chicken Pizza Regular" },
            { id: "3", name: "Classic Pizza Extra Cheese Small" },
        ];
        setOrderTypes(sampleOrderTypes);

        // Sample orders array
        const sampleOrders = [
            { id: "1", order: "Teriyaki Pizza Large", status: "Completed" },
            { id: "2", order: "Spicy Chicken Pizza Regular", status: "Pending" },
            { id: "3", order: "Classic Pizza Extra Cheese Small", status: "In Progress" },
        ];
        setOrders(sampleOrders);
    }, []);

    const handleAddOrder = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3000/orders", newOrder)
            .then(response => {
                setOrders([...orders, response.data]);
                setNewOrder({ order: "", status: "Pending" });
            })
            .catch(error => {
                console.error("Error adding order:", error);
            });
    };

    const allowedRoles = ["admin", "chef", "waiter"];

    return (
        <Card className={'flex flex-col max-w-96 min-h-96'}>
            <CardHeader>
                <CardTitle>Table {tableId}</CardTitle>
                <CardDescription>{tableSeats} seats</CardDescription>
            </CardHeader>
            <CardContent className={'flex-grow'}>
                <Table>
                    <TableCaption>Orders</TableCaption>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.order}</TableCell>
                                <TableCell>{order.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <Popover>
                    <PopoverTrigger>Add New Order</PopoverTrigger>
                    <PopoverContent>
                        <form onSubmit={handleAddOrder} className={"flex flex-col"}>
                            <Select onValueChange={(value) => setNewOrder({...newOrder, order: value})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Order Type"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {orderTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button type="submit" className={'mt-4'}>Add Order</Button>
                        </form>
                    </PopoverContent>
                </Popover>
            </CardFooter>
        </Card>
    )
}