import {useEffect, useState} from "react";
import DiningTable from "@/components/DiningTable";
import {useAuth} from "@/context/AuthContext.tsx";
import axios from "axios";
import api from "@/lib/api/api.ts";
import {Table} from "@/types/Table.tsx";

export default function Dashboard() {
    const { selectedRestaurant } = useAuth();
    const [tables, setTables] = useState<Table[]>([]);

    useEffect(() => {
        const getTables = async () => {
            // console.log(selectedRestaurant._id)
            api.get(`/tables/${selectedRestaurant?._id}`)
                .then(response => {
                    setTables(response.data);
                })
                .catch(error => {
                    console.error("Error fetching order:", error);
                });

            // try {
            //     const token = localStorage.getItem('accessToken');
            //     const response = await api.get(`http://localhost:3000/restaurants/${selectedRestaurant._id}/tables`, {
            //         headers: {
            //             'Authorization': `Bearer ${token}`
            //         }
            //     });
            //     console.log(response.data);
            //     setTables(response.data);
            // } catch (error) {
            //     console.error("Error fetching tables:", error);
            // }

        };

        if (selectedRestaurant) {
            getTables();
        }
    }, [selectedRestaurant]);

    return (
        <div className={"flex flex-wrap"}>
            {tables.map((table) => (
                <DiningTable key={table._id} tableId={table._id} tableNo={table.no} tableSeats={table.seats} />
            ))}
        </div>
    );
}