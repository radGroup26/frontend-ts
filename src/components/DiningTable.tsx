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

    useEffect(() => {
        // // Fetch orders from the backend
        // axios.get("http://localhost:3000/orders")
        //     .then(response => {
        //         setOrders(response.data);
        //     })
        //     .catch(error => {
        //         console.error("Error fetching orders:", error);
        //     });

        // Sample orders array
        const sampleOrders = [
            { id: "1", order: "Teriyaki Pizza Large", status: "Completed" },
            { id: "2", order: "Spicy Chicken Pizza Regular", status: "Pending" },
            { id: "3", order: "Classic Pizza Extra Cheese Small", status: "In Progress" },
        ];
        setOrders(sampleOrders);
    }, []);

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
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button>Add Order</Button>
                    </PopoverContent>
                </Popover>
            </CardFooter>
        </Card>
    )
}