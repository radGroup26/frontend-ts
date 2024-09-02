import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useFormik } from "formik";
import api from "@/lib/api/api";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import fetchMembers from "@/lib/api/fetchMembers";
import fetchRestaurants from "@/lib/api/fetchRestaurants";

export default function ManageTeamDialog() {
    const { selectedRestaurant } = useAuth();
    const queryClient = useQueryClient();
    const members = useQuery({
        queryKey: ['members', selectedRestaurant],
        queryFn: fetchMembers
    })

    const [inviteError, setInviteError] = useState<string | null>(null);

    const updateTeamName = useFormik({
        initialValues: {
            newName: selectedRestaurant?.name,
            teamId: selectedRestaurant
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            api.put(`/teams/name`, values, { withCredentials: true })
                .then((response) => {
                    console.log(response);
                    queryClient.invalidateQueries({
                        queryKey: ['restaurants']
                    });
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    })

    const inviteMemberForm = useFormik({
        initialValues: {
            teamId: selectedRestaurant,
            username: '',
            role: 'member'
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            api.post('/teams/invite', values, { withCredentials: true })
                .then((response) => {
                    console.log(response);
                    setInviteError(null);
                })
                .catch((error) => {
                    console.log(error);
                    setInviteError("Failed to invite member. Please try again.");
                })
        },
    })

    if (!selectedRestaurant) {
        return null;
    }

    if (members.isLoading) {
        return <div>Loading...</div>
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-1">
                    Manage
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Manage your team</DialogTitle>
                    <DialogDescription>
                        Invite team members, change team name and more.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    {selectedRestaurant?.type === 'owner' && (
                        <>
                            <div>
                                <h1 className="text-gray-800">Change restaurant name</h1>
                                <h2 className="mb-4 text-xs text-gray-700">Change the name of your restaurant</h2>

                                <form onSubmit={updateTeamName.handleSubmit}>
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input
                                            id="newName"
                                            className="col-span-3"
                                            name="newName"
                                            value={updateTeamName.values.newName}
                                            onChange={updateTeamName.handleChange}
                                        />
                                        <Button type="submit">Update</Button>
                                    </div>
                                </form>
                            </div>

                            <div className="mt-8">
                                <h1 className="text-gray-800">Invite a Member</h1>
                                <h2 className="mb-4 text-xs text-gray-700">Invite a member to the resataurant</h2>

                                <form onSubmit={inviteMemberForm.handleSubmit}>
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="name" className="text-right">
                                            Email
                                        </Label>
                                        <Input
                                            id="username"
                                            className="col-span-3"
                                            name="username"
                                            value={inviteMemberForm.values.username}
                                            onChange={inviteMemberForm.handleChange}
                                        />
                                        <Button type="submit">Invite</Button>
                                    </div>
                                    {inviteError && (
                                        <div className="text-xs text-red-700 mt-2">
                                            {inviteError}
                                        </div>
                                    )}
                                </form>

                                {members.data?.map((member) => (
                                    <div key={member._id} className="flex items-center gap-2">
                                        <div>{member.user}</div>
                                        <div>{member.role}</div>
                                        <div>{member.accepted ? 'Accepted' : 'Pending'}</div>
                                    </div>
                                ))}
                            </div></>
                    )}
                </div>
                {/* <DialogFooter>
                    <Button type="submit">Create</Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>

    )
}