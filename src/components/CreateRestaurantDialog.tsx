import api from "@/lib/api/api";
import fetchRestaurants from "@/lib/api/fetchRestaurants";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function CreateRestaurantDialog() {
    const [openCreateTeam, setOpenCreateTeam] = useState(false);

    const restaurants = useQuery({
        queryKey: ['restaurants'],
        queryFn: fetchRestaurants
    })

    if (restaurants.isLoading) {
        return <div>Loading...</div>
    }

    const createTeamForm = useFormik({
        initialValues: {
            name: '',
        },
        onSubmit: (values) => {
            api.post('/teams', values, { withCredentials: true })
                .then((response) => {
                    console.log(response);
                    restaurants.refetch();
                    setOpenCreateTeam(false)
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    })

    return (
        <Dialog open={openCreateTeam} onOpenChange={setOpenCreateTeam}>
            <DialogTrigger asChild>
                <Button className="gap-1">
                    <Plus className="size-3.5" />
                    Restaurant
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={createTeamForm.handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create a new restaurant</DialogTitle>
                        <DialogDescription>
                            Create a new restaurant to start adding staff and managing orders.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                className="col-span-3"
                                name="name"
                                value={createTeamForm.values.name}
                                onChange={createTeamForm.handleChange}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}