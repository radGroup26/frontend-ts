import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import fetchRestaurants from "@/lib/api/fetchRestaurants";
import { cn } from "@/lib/utils";
import { Restaurant } from "@/types/retaurant";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";


interface Option {
    name: string;
    value: string;
}

interface Props {
    isCollapsed: boolean
}

export default function Switcher({
    isCollapsed,
}: Props) {
    const [selected, setSelected] = useState<string | undefined>(undefined);
    const { setSelectedRestaurant } = useAuth();


    const restaurants = useQuery({
        queryKey: ['restaurants'],
        queryFn: fetchRestaurants
    })

    if (restaurants.isLoading) {
        return <div>Loading...</div>
    }

    // option for the select from the data from restaurants.data
    const options = restaurants.data?.map((restaurant: any) => ({
        name: restaurant.name,
        value: restaurant._id,
    }));

    // use selected to set selectedRestaurant using data from restautat.data
    useEffect(() => {
        // dont run on first render with if
        if (selected) {
            // find the restaurant with the selected id
            const restaurant = restaurants.data?.find((restaurant: Restaurant) => restaurant._id === selected);
            setSelectedRestaurant(restaurant);
        }
    }, [selected]);

    useEffect(() => {
        if (restaurants.data && restaurants.data.length > 0) {
            setSelected(restaurants.data[0]._id);
        }
    }, [restaurants.data]);

    return (
        <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger
                className={cn(
                    "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
                    isCollapsed &&
                    "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
                )}
                aria-label="Select account"
            >
                <SelectValue placeholder="Select a restaurant">
                    {options?.length && (
                        <span className={cn("ml-2", isCollapsed && "hidden")}>
                            {options.find((item) => item.value === selected)?.name}
                        </span>
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {options?.length ? (
                    options.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                                {item.name}
                            </div>
                        </SelectItem>
                    ))
                ) : (
                    <SelectItem value="adas" disabled>Loading...</SelectItem>
                )}
            </SelectContent>
        </Select>
    )
}