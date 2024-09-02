import {useEffect, useState} from "react";
import DiningTable from "@/components/DiningTable";
import {useAuth} from "@/context/AuthContext.tsx";
import axios from "axios";

export default function Dashboard() {
    const { selectedRestaurant } = useAuth();
    const [tables, setTables] = useState([]);

    useEffect(() => {
        const getTables = async () => {
            console.log(selectedRestaurant._id)

            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`http://localhost:3000/restaurants/${selectedRestaurant._id}/tables`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(response.data);
                setTables(response.data);
            } catch (error) {
                console.error("Error fetching tables:", error);
            }
        };

        if (selectedRestaurant) {
            getTables();
        }
    }, [selectedRestaurant]);

    return (
        <div className={"flex"}>
            {tables.map((table) => (
                <DiningTable key={table._id} tableId={table._id} tableNo={table.no} tableSeats={table.seats} />
            ))}
        </div>
    );
}