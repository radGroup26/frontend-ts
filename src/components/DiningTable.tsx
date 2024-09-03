import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import axios from "axios";
import {useAuth} from "@/context/AuthContext.tsx";
import {Order} from "@/types/order.tsx";
import {Item} from "@/types/Item.tsx";
import api from "@/lib/api/api.ts"

interface DiningTableProps {
    tableId: string;
    tableNo: string;
    tableSeats: string;
}

export default function DiningTable({ tableId, tableNo, tableSeats }: DiningTableProps) {
    const { selectedRestaurant } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [orderFinished, setOrderFinished] = useState(false);
    const [orderDeclined, setOrderDeclined] = useState(false);
    const [newOrder, setNewOrder] = useState({ restaurantId: selectedRestaurant?._id,
        tableId:tableId, name: "", quantity: 1, status: "Pending" });
    const [deleteOrder, setDeleteOrder] = useState({ orderId: "" });
    const token = localStorage.getItem('accessToken');
    const quantity = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // const allowedRoles = ["admin", "chef", "waiter"];
    // console.log(orderTypes[0].items)
    // console.log(orders)
    // console.log(tableId)


    useEffect(() => {
        // // Fetch orders from the backend
        api.get(`/orders/${tableId}`)
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error("Error fetching order types:", error);
            });

        // Fetch available order types from the backend
        api.get(`/items/${selectedRestaurant?._id}`)
            .then(response => {
                setItems(response.data);
            })
            .catch(error => {
                console.error("Error fetching order types:", error);
            });
    }, [newOrder, deleteOrder, orderFinished, orderDeclined]);

    // handle Waiter's Add order Submit
    const handleAddOrder = (e) => {
        e.preventDefault();
        api.post("/orders/create", newOrder)
            .then(response => {
                setOrders([...orders, response.data]);
                setNewOrder({ restaurantId: selectedRestaurant._id,
                    tableId:tableId, name: "", quantity:1, status: "Pending" });
            })
            .catch(error => {
                console.error("Error adding order:", error);
            });
    };

    // handle Chef's Delete order Submit
    const handleDeleteOrder = (e) => {
        e.preventDefault();
        api.post("/orders/delete", deleteOrder)
            .then(response => {
                setOrders([...orders, response.data]);
                setDeleteOrder({ orderId: "" });
            })
            .catch(error => {
                console.error("Error Delete order:", error);
            });
    };

    // handle Waiter's Finish order Submit
    const handleOrderFinish = (orderId: string) => {
        api.post('/orders/finish', { orderId })
            .then(response => {
                // Handle successful response
                console.log('Order finished:', response.data);
                setOrderFinished(!orderFinished);
            })
            .catch(error => {
                // Handle error
                console.error('Error finishing order:', error);
            });
    }

    // handle Waiter's Decline order Submit
    const handleOrderDecline = (orderId: string) => {
        api.post('/orders/decline', { orderId })
            .then(response => {
                // Handle successful response
                console.log('Order Declined:', response.data);
                setOrderFinished(!orderDeclined);
            })
            .catch(error => {
                // Handle error
                console.error('Error declining order:', error);
            });
    }

    // Display orders
    let orderContent;
    if (orders.length > 0) {
        orderContent = (
        <Table>
            <TableCaption>Orders</TableCaption>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order._id}>
                        <TableCell>{order.name}</TableCell>
                        <TableCell>{`${order.quantity}`}</TableCell>
                        <TableCell align={"center"}>
                            {order.status === 'Completed' ? (
                                <Button onClick={() => handleOrderFinish(order._id)}>Finish Order</Button>
                            ) : order.status === 'Cancelled' ? (
                                <Button onClick={() => handleOrderDecline(order._id)}>Confirm Cancel</Button>
                            ) : (
                                order.status
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        )
    } else {
        orderContent = (
            <div>No Orders</div>
        )
    }

    // Waiters Footer Content
    let addOrderContent =(
        <Popover>
            <PopoverTrigger className="absolute right-10 mb-5">Add New Order</PopoverTrigger>
            <PopoverContent>
                <form onSubmit={handleAddOrder} className={"flex flex-col"}>
                    <div className={"m-1"}>
                        <Select onValueChange={(value) => setNewOrder({...newOrder, name: value})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Order Type"/>
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
                    <div className={"m-1"}>
                        <Select  defaultValue={quantity[0].toString()}
                                 onValueChange={(value) => setNewOrder({...newOrder, quantity: Number(value)})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Quantity"/>
                            </SelectTrigger>
                            <SelectContent>
                                {quantity.slice().reverse().map((quantity) => (
                                    <SelectItem key={quantity} value={quantity.toString()}>
                                        {quantity}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className={'my-3 mx-1'}>Add Order</Button>
                </form>
            </PopoverContent>
        </Popover>
    )

    // Chef Footer Content
    let deleteOrderContent =(
        <Popover>
            <PopoverTrigger className="absolute right-10 mb-5">Delete Order</PopoverTrigger>
            <PopoverContent>
                <form onSubmit={handleDeleteOrder} className={"flex flex-col"}>
                    <div className={"m-1"}>
                        <Select onValueChange={(value) => setDeleteOrder({...deleteOrder, orderId: value})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Order"/>
                            </SelectTrigger>
                            <SelectContent>
                                {orders.map((order) => (
                                    <SelectItem key={order._id} value={order._id}>
                                        {order.name + " x" + order.quantity}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className={'my-3 mx-1'}>Delete Order</Button>
                </form>
            </PopoverContent>
        </Popover>
    )


    return (
        <Card className={'flex flex-col min-w-96 min-h-96 m-3'}>
            <CardHeader>
                <CardTitle>Table {tableNo}</CardTitle>
                <CardDescription>{tableSeats} seats</CardDescription>
            </CardHeader>
            <CardContent className={'flex-grow'}>
                {orderContent}
            </CardContent>
            <CardFooter className="relative">
                {addOrderContent}
                {/*{deleteOrderContent}*/}
            </CardFooter>
        </Card>
    )
}