// components.tsx
import { Button } from "@/components/ui/button";
import { useInviteMemberForm, useUpdateTeamNameForm } from "@/hooks/layoutHooks";
import type { Restaurant } from "@/types/retaurant";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Member } from "@/types/member";

export const ManageTeamDialog = ({ selectedRestaurantAuth, selectedRestaurant, members, inviteError, setInviteError }:
    {
        selectedRestaurantAuth: Restaurant | undefined,
        selectedRestaurant: string | undefined, members: Member[],
        inviteError: string | null, setInviteError: React.Dispatch<React.SetStateAction<string | null>>
    }) => {
    const updateTeamName = useUpdateTeamNameForm(selectedRestaurantAuth, selectedRestaurant);
    const inviteMemberForm = useInviteMemberForm(selectedRestaurant, setInviteError);

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
                    {selectedRestaurantAuth?.type === 'owner' && (
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
                                <h2 className="mb-4 text-xs text-gray-700">Invite a member to the restaurant</h2>

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

                                {members.map((member) => (
                                    <div key={member._id} className="flex items-center gap-2">
                                        <div>{member.user}</div>
                                        <div>{member.role}</div>
                                        <div>{member.accepted ? 'Accepted' : 'Pending'}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};