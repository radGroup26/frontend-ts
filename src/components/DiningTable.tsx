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
    const [orderChanged, setOrderChanged] = useState(false);
    const [newOrder, setNewOrder] = useState({ restaurantId: selectedRestaurant?._id,
        tableId:tableId, name: "", quantity: 1, status: "Pending" });
    const [deleteOrder, setDeleteOrder] = useState({ orderId: "" });
    const [cancelOrder, setCancelOrder] = useState({ orderId: "" });
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
    }, [newOrder, deleteOrder, cancelOrder, orderChanged]);

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

    // handle Waiter's Delete order Submit
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

    // handle Chef's Cancel order Submit
    const handleCancelOrder = (e) => {
        e.preventDefault();
        api.post("/orders/cancel", cancelOrder)
            .then(response => {
                setOrders([...orders, response.data]);
                setCancelOrder({ orderId: "" });
            })
            .catch(error => {
                console.error("Error Cancel order:", error);
            });
    };

    // handle Waiter's Finish order Submit
    const handleOrderFinish = (orderId: string) => {
        api.post('/orders/finish', { orderId })
            .then(response => {
                // Handle successful response
                console.log('Order finished:', response.data);
                setOrderChanged(!orderChanged);
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
                setOrderChanged(!orderChanged);
            })
            .catch(error => {
                // Handle error
                console.error('Error declining order:', error);
            });
    }

    // handle Chef's Start order Submit
    const handleOrderStart = (orderId: string) => {
        api.post('/orders/start', { orderId })
            .then(response => {
                // Handle successful response
                console.log('Order Started:', response.data);
                setOrderChanged(!orderChanged);
            })
            .catch(error => {
                // Handle error
                console.error('Error starting order:', error);
            });
    }

    // handle Chef's Complete order Submit
    const handleOrderComplete = (orderId: string) => {
        api.post('/orders/complete', { orderId })
            .then(response => {
                // Handle successful response
                console.log('Order Complete:', response.data);
                setOrderChanged(!orderChanged);
            })
            .catch(error => {
                // Handle error
                console.error('Error completing order:', error);
            });
    }

    // Display orders
    let orderContent;
    if (orders.length === 0) {
        orderContent = (
            <div>No Orders</div>
        )
    } else {
        // Waiters Perspective
        // orderContent = (
        //     <Table>
        //         <TableCaption>Orders</TableCaption>
        //         <TableBody>
        //             {orders.map((order) => (
        //                 <TableRow key={order._id}>
        //                     <TableCell>{order.name}</TableCell>
        //                     <TableCell>{`${order.quantity}`}</TableCell>
        //                     <TableCell align={"center"}>
        //                         {order.status === 'Completed' ? (
        //                             <Button className={'w-full'} onClick={() => handleOrderFinish(order._id)}>Finish Order</Button>
        //                         ) : order.status === 'Cancelled' ? (
        //                             <Button className={'w-full'} onClick={() => handleOrderDecline(order._id)}>Confirm Cancel</Button>
        //                         ) : (
        //                             order.status
        //                         )}
        //                     </TableCell>
        //                 </TableRow>
        //             ))}
        //         </TableBody>
        //     </Table>
        // )

        // Chef's Perspective
        orderContent = (
            <Table>
                <TableCaption>Orders</TableCaption>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order._id}>
                            <TableCell>{order.name}</TableCell>
                            <TableCell>{`${order.quantity}`}</TableCell>
                            <TableCell align={"center"}>
                                {order.status === 'Pending' ? (
                                    <Button className={'w-full'} onClick={() => handleOrderStart(order._id)}>Start</Button>
                                ) : order.status === 'InProgress' ? (
                                    <Button className={'w-full'} onClick={() => handleOrderComplete(order._id)}>Complete</Button>
                                ) : (
                                    order.status
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )

        // Admin Perspective
        // orderContent = (
        //     <Table>
        //         <TableCaption>Orders</TableCaption>
        //         <TableBody>
        //             {orders.map((order) => (
        //                 <TableRow key={order._id}>
        //                     <TableCell>{order.name}</TableCell>
        //                     <TableCell>{`${order.quantity}`}</TableCell>
        //                     <TableCell align={"center"}>{order.status}</TableCell>
        //                 </TableRow>
        //             ))}
        //         </TableBody>
        //     </Table>
        // )
    }

    // Waiters Footer Content
    let addOrderContent =(
        <Popover>
            <PopoverTrigger className="" asChild>
                <Button>Add New Order</Button>
            </PopoverTrigger>
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

    // Only Pending Data can be deleted
    let deleteOrderContent =(
        <Popover>
            <PopoverTrigger className="" asChild>
                <Button variant="outline">Delete Order</Button>
            </PopoverTrigger>
            <PopoverContent>
                <form onSubmit={handleDeleteOrder} className={"flex flex-col"}>
                    <div className={"m-1"}>
                        <Select onValueChange={(value) => setDeleteOrder({...deleteOrder, orderId: value})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Order"/>
                            </SelectTrigger>
                            <SelectContent>
                                {orders.filter(order => order.status === 'Pending').map((order) => (
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

    // Chef's Footer Content
    let cancelOrderContent =(
        <Popover>
            <PopoverTrigger className="" asChild>
                <Button>Cancel Order</Button>
            </PopoverTrigger>
            <PopoverContent>
                <form onSubmit={handleCancelOrder} className={"flex flex-col"}>
                    <div className={"m-1"}>
                        <Select onValueChange={(value) => setCancelOrder({...cancelOrder, orderId: value})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Order"/>
                            </SelectTrigger>
                            <SelectContent>
                                {/*{orders.filter(order => order.status === 'Pending' || order.status === 'InProgress').length === 0 ? (*/}
                                {/*    <SelectItem disabled>No Orders Available</SelectItem>*/}
                                {/*) : (*/}
                                {/*    orders.filter(order => order.status === 'Pending' || order.status === 'InProgress').map((order) => (*/}
                                {/*        <SelectItem key={order._id} value={order._id}>*/}
                                {/*            {order.name + " x" + order.quantity}*/}
                                {/*        </SelectItem>*/}
                                {/*    ))*/}
                                {/*)}*/}
                                {orders.filter(order => order.status === 'Pending' || order.status === 'InProgress').map((order) => (
                                    <SelectItem key={order._id} value={order._id}>
                                        {order.name + " x" + order.quantity}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className={'my-3 mx-1'}>Cancel Order</Button>
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
            <CardFooter className="flex justify-end mb-1 gap-3">
                {deleteOrderContent}
                {/*{cancelOrderContent}*/}
                {addOrderContent}
            </CardFooter>
        </Card>
    )
}