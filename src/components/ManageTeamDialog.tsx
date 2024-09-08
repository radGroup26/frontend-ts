import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api/api";
import fetchMembers from "@/lib/api/fetchMembers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

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
            teamId: selectedRestaurant?._id,
            username: '',
            role: ''
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            // console.log(values);

            api.post('/teams/invite', values, { withCredentials: true })
                .then((response) => {
                    console.log(response);
                    members.refetch();
                    setInviteError(null);
                })
                .catch((error) => {
                    console.log(error);
                    const errorMessage = error.response?.data?.message || "Failed to invite member. Please try again.";
                    setInviteError(errorMessage);
                })

        },
    })

    if (!selectedRestaurant) {
        return null;
    }

    if (members.isLoading) {
        return <div>Loading...</div>
    }


    function handleRemoveMember(userId: string) {
        api.post('/teams/memberRemove/', { teamId: selectedRestaurant?._id, userId }, { withCredentials: true })
            .then((response) => {
                console.log(response);
                members.refetch();
            })
            .catch((error) => {
                console.log(error);
            })

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
                                        <Label htmlFor="newName" className="text-right">
                                            Name
                                        </Label>
                                        <Input
                                            id="newName"
                                            className="col-span-3"
                                            name="newName"
                                            value={updateTeamName.values.newName}
                                            onChange={updateTeamName.handleChange}
                                            placeholder="New Name"
                                        />
                                        <Button type="submit">Update</Button>
                                    </div>
                                </form>
                            </div>

                            <div className="mt-8">
                                <h1 className="text-gray-800">Invite a Member</h1>
                                <h2 className="mb-4 text-xs text-gray-700">Invite a member to the resataurant</h2>

                                <form onSubmit={inviteMemberForm.handleSubmit}>
                                    <div className="flex flex-col gap-2">
                                        {/* <Label htmlFor="name" className="text-right">
                                            Email
                                        </Label> */}
                                        <div className="flex gap-2">
                                            <Input
                                                id="username"
                                                name="username"
                                                value={inviteMemberForm.values.username}
                                                onChange={inviteMemberForm.handleChange}
                                                placeholder="Email"
                                                autoCapitalize="none"
                                            />
                                            <Select
                                                value={inviteMemberForm.values.role}
                                                onValueChange={(value) => inviteMemberForm.setFieldValue('role', value)}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select a Role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Roles</SelectLabel>
                                                        <SelectItem value="waiter">Waiter</SelectItem>
                                                        <SelectItem value="chef">Chef</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button type="submit">Invite</Button>
                                    </div>

                                    {inviteError && (
                                        <div className="text-xs text-red-700 mt-2">
                                            {inviteError}
                                        </div>
                                    )}
                                </form>
                            </div>
                            <div className="mt-8">
                                <h1 className="text-gray-800">Members</h1>
                                <h2 className="mb-4 text-xs text-gray-700">Members in your restaurant</h2>

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {/* <TableHead className="w-[100px]">ID</TableHead> */}
                                            <TableHead>Username</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Invite</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {members.data?.map((member) => (
                                            <TableRow key={member._id}>
                                                {/* <TableCell className="font-medium">{member.user}</TableCell> */}
                                                <TableCell className="font-medium">{member.username}</TableCell>
                                                <TableCell>{member.role}</TableCell>
                                                <TableCell>{member.accepted ? 'Accepted' : 'Pending'}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="destructive" onClick={() => handleRemoveMember(member.user)}>Remove</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                </div>
                {/* <DialogFooter>
                    <Button type="submit">Create</Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>

    )
}