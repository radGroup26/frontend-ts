import {
    LayoutDashboard,
    LifeBuoy,
    LogOut,
    SquareUser,
    UserCog
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api/api";
import fetchRestaurants from "@/lib/api/fetchRestaurants";
import { cn } from "@/lib/utils";
import { Member } from "@/types/member";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CreateRestaurantDialog from "./CreateRestaurantDialog";
import Logo from "./Logo";
import ManageTeamDialog from "./ManageTeamDialog";
import Nav from "./Nav";
import Switcher from "./Switcher";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Link } from 'react-router-dom';


const navItems1 = [
    { icon: LayoutDashboard, ariaLabel: "Dashboard", tooltip: "Dashboard", route: "/dashboard" },
    { icon: UserCog, ariaLabel: "Invites", tooltip: "Invites", route: "/invites" },

];

const navItems2 = [
    { icon: LifeBuoy, ariaLabel: "Help", tooltip: "Help", route: "/help" },
    { icon: SquareUser, ariaLabel: "Account", tooltip: "Account", route: "/account" },
];

export default function Layout({ children }: { children: JSX.Element }) {
    const { logout, role } = useAuth();


    const restaurants = useQuery({
        queryKey: ['restaurants'],
        queryFn: fetchRestaurants
    })

    if (restaurants.isLoading) {
        return <div>Loading...</div>
    }

    function handleLogout(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        api.post('/auth/logout', {}, { withCredentials: true })
            .then((response) => {
                logout();
                console.log(response);
            })
    }

    // const createTeamForm = useFormik({
    //     initialValues: {
    //         name: '',
    //     },
    //     onSubmit: (values) => {
    //         api.post('/teams', values, { withCredentials: true })
    //             .then((response) => {
    //                 console.log(response);
    //                 const data = response.data.team;
    //                 const newRestaurant: Restaurant = {
    //                     _id: data._id,
    //                     name: data.name,
    //                     type: 'owner'
    //                 }
    //                 // setRestaurants((old) => {
    //                 //     return [...old, newRestaurant];
    //                 // });
    //                 setOpenCreateTeam(false)
    //             })
    //             .catch((error) => {
    //                 console.log(error);
    //             })
    //     }
    // })

    // useEffect(() => {
    //     setSelectedRestaurantAuth(restaurants.find(restaurant => restaurant._id === selectedRestaurant));
    // }, [selectedRestaurant])

    // const [openCreateTeam, setOpenCreateTeam] = useState(false);


    // const options = useMemo(() => {
    //     return restaurants.data.map(restaurant => ({
    //         value: restaurant._id,
    //         name: restaurant.name
    //     }));
    // }, [restaurants]);


    // const [inviteError, setInviteError] = useState<string | null>(null);
    // const inviteMemberForm = useFormik({
    //     initialValues: {
    //         teamId: selectedRestaurant,
    //         username: '',
    //         role: 'member'
    //     },
    //     enableReinitialize: true,
    //     onSubmit: (values) => {
    //         console.log(selectedRestaurant);

    //         api.post('/teams/invite', values, { withCredentials: true })
    //             .then((response) => {
    //                 console.log(response);
    //                 setInviteError(null);
    //             })
    //             .catch((error) => {
    //                 console.log(error);
    //                 setInviteError("Failed to invite member. Please try again.");
    //             })
    //     },
    // })


    // useEffect(() => {
    //     if (selectedRestaurant) {
    //         api.post('/teams/members', { teamId: selectedRestaurant }, { withCredentials: true })
    //             .then((response) => {
    //                 const members = response.data.members
    //                 setMembers(members);
    //             })
    //             .catch((error) => {
    //                 console.log(error);
    //             });
    //     }
    // }, [selectedRestaurant])


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
                                        <Link to={item.route}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={cn('rounded-lg')}
                                            aria-label={item.ariaLabel}
                                        >
                                            <item.icon className="size-5" />
                                        </Button>
                                        </Link>
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
                    <Switcher isCollapsed={false} />
                </div>

                <CreateRestaurantDialog />
                <ManageTeamDialog />

            <div>{role}</div>

            </header>

            <main className="px-4 pt-2">

                {children}

            </main>
        </div>

    )
}
