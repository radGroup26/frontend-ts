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
import {useAuth} from "@/context/AuthContext.tsx";

interface DiningTableProps {
    tableId: string;
    tableNo: string;
    tableSeats: string;
}

export default function DiningTable({ tableId, tableNo, tableSeats }: DiningTableProps) {
    const [orders, setOrders] = useState([]);
    const [orderTypes, setOrderTypes] = useState([]);
    const [newOrder, setNewOrder] = useState({ order: "", status: "" });
    const { selectedRestaurant } = useAuth();
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        // // Fetch orders from the backend
        // axios.get("http://localhost:3000/orders")
        //     .then(response => {
        //         setOrders(response.data);
        //     })
        //     .catch(error => {
        //         console.error("Error fetching orders:", error);
        //     });

        // Fetch available order types from the backend
        axios.get(`http://localhost:3000/menus/${selectedRestaurant._id}`, {
                headers: {
                'Authorization': `Bearer ${token}`}
            })
            .then(response => {
                setOrderTypes(response.data);
            })
            .catch(error => {
                console.error("Error fetching order types:", error);
            });

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
    // console.log(orderTypes[0].items)

    return (
        <Card className={'flex flex-col max-w-96 min-h-96 m-3'}>
            <CardHeader>
                <CardTitle>Table {tableNo}</CardTitle>
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
            <CardFooter className="relative">
                <Popover>
                    <PopoverTrigger className="absolute right-10 mb-5">Add New Order</PopoverTrigger>
                    <PopoverContent>
                        <form onSubmit={handleAddOrder} className={"flex flex-col"}>
                            <Select onValueChange={(value) => setNewOrder({...newOrder, order: value})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Order Type"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {orderTypes.map((type) => (
                                        <SelectItem key={type._id} value={type.name + ' ' + type.option}>
                                            {type.name + ' ' + type.option}
                                        </SelectItem>
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