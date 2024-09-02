import {
    LayoutDashboard,
    LifeBuoy,
    LogOut,
    Plus,
    SquareUser,
    Store
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Member } from "@/types/member";
import type { Restaurant } from "@/types/retaurant";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import Logo from "./Logo";
import Nav from "./Nav";
import Switcher from "./Switcher";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";


const navItems1 = [
    { icon: LayoutDashboard, ariaLabel: "Dashboard", tooltip: "Dashboard", route: "/dashboard" },
    { icon: Store, ariaLabel: "Restaurants", tooltip: "Restaurants", route: "/restaurants" },

];

const navItems2 = [
    { icon: LifeBuoy, ariaLabel: "Help", tooltip: "Help", route: "/help" },
    { icon: SquareUser, ariaLabel: "Account", tooltip: "Account", route: "/account" },
];

export default function Layout({ children }: { children: JSX.Element }) {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<string | undefined>(undefined)
    const { logout, setSelectedRestaurant: setSelectedRestaurantAuth, selectedRestaurant: selectedRestaurantAuth } = useAuth();

    useEffect(() => {
        api.get('/teams', { withCredentials: true })
            .then((response) => {
                const ownerTeams = response.data.ownerTeams;
                const memberTeams = response.data.memberTeams;

                const teams = [
                    ...ownerTeams.map((team: any) => ({ ...team, type: 'owner' })),
                    ...memberTeams.map((team: any) => ({ ...team, type: 'member' }))
                ];

                setRestaurants(teams);
                setSelectedRestaurant(ownerTeams[0]._id);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    function handleLogout(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        api.post('/auth/logout', {}, { withCredentials: true })
            .then((response) => {
                logout();
                console.log(response);
            })
    }

    const createTeamForm = useFormik({
        initialValues: {
            name: '',
        },
        onSubmit: (values) => {
            api.post('/teams', values, { withCredentials: true })
                .then((response) => {
                    console.log(response);
                    const data = response.data.team;
                    const newRestaurant: Restaurant = {
                        _id: data._id,
                        name: data.name,
                        type: 'owner'
                    }
                    setRestaurants((old) => {
                        return [...old, newRestaurant];
                    });
                    setOpenCreateTeam(false)
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    })

    useEffect(() => {
        setSelectedRestaurantAuth(restaurants.find(restaurant => restaurant._id === selectedRestaurant));
    }, [selectedRestaurant])

    const [openCreateTeam, setOpenCreateTeam] = useState(false);


    const updateTeamName = useFormik({
        initialValues: {
            newName: selectedRestaurantAuth?.name,
            teamId: selectedRestaurant
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            api.put(`/teams/name`, values, { withCredentials: true })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    })

    const options = useMemo(() => {
        return restaurants.map(restaurant => ({
            value: restaurant._id,
            name: restaurant.name
        }));
    }, [restaurants]);


    const [inviteError, setInviteError] = useState<string | null>(null);
    const inviteMemberForm = useFormik({
        initialValues: {
            teamId: selectedRestaurant,
            username: '',
            role: 'member'
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            console.log(selectedRestaurant);

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


    useEffect(() => {
        if (selectedRestaurant) {
            api.post('/teams/members', { teamId: selectedRestaurant }, { withCredentials: true })
                .then((response) => {
                    const members = response.data.members
                    setMembers(members);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [selectedRestaurant])


    return (

        <div className="grid grid-cols-[min-content_auto] grid-rows-[min-content_auto] h-screen">
            <div className="border-b border-r p-2 flex items-center justify-center">
                <Logo onlyIcon iconSize="size-8" />
            </div>

            <aside className="row-start-2 row-end-3 flex h-full flex-col border-r">

                <Nav navItems={navItems1} />

                <div className="mt-auto">
                    <TooltipProvider>
                        <nav className="grid gap-1 p-2">
                            {navItems2.map((item, index) => (
                                <Tooltip key={index}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={cn('rounded-lg')}
                                            aria-label={item.ariaLabel}
                                        >
                                            <item.icon className="size-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" sideOffset={5}>
                                        {item.tooltip}
                                    </TooltipContent>
                                </Tooltip>
                            ))}

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <form onSubmit={handleLogout}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={cn('rounded-lg')}
                                            aria-label='logout button'
                                        >
                                            <LogOut className="size-5" />
                                        </Button>
                                    </form>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={5}>
                                    Logout
                                </TooltipContent>
                            </Tooltip>
                        </nav>
                    </TooltipProvider>
                </div>
            </aside>

            <header className="flex items-center gap-1 border-b bg-background px-4">
                <div className="w-64">
                    <Switcher isCollapsed={false} options={options} selected={selectedRestaurant} setSelected={setSelectedRestaurant} />
                </div>

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

                {/* Manage team */}
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

                                        {members.map((member) => (
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
            </header>

            <main className="px-4 pt-2">

                {children}

            </main>
        </div>

    )
}
