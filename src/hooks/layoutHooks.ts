// hooks.ts
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import api from "@/lib/api/api";
import { useAuth } from "@/context/AuthContext";
import { Member } from "@/types/member";
import { Restaurant } from "@/types/retaurant";

export const useRestaurants = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<string | undefined>(undefined);
    const { setSelectedRestaurant: setSelectedRestaurantAuth } = useAuth();

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

    useEffect(() => {
        setSelectedRestaurantAuth(restaurants.find(restaurant => restaurant._id === selectedRestaurant));
    }, [selectedRestaurant]);

    return { restaurants, selectedRestaurant, setSelectedRestaurant };
};

export const useMembers = (selectedRestaurant: string | undefined) => {
    const [members, setMembers] = useState<Member[]>([]);

    useEffect(() => {
        if (selectedRestaurant) {
            api.post('/teams/members', { teamId: selectedRestaurant }, { withCredentials: true })
                .then((response) => {
                    const members = response.data.members;
                    setMembers(members);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [selectedRestaurant]);

    return { members };
};

export const useCreateTeamForm = (setRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>, setOpenCreateTeam: React.Dispatch<React.SetStateAction<boolean>>) => {
    return useFormik({
        initialValues: {
            name: '',
        },
        onSubmit: (values) => {
            api.post('/teams', values, { withCredentials: true })
                .then((response) => {
                    const data = response.data.team;
                    const newRestaurant: Restaurant = {
                        _id: data._id,
                        name: data.name,
                        type: 'owner'
                    };
                    setRestaurants((old) => [...old, newRestaurant]);
                    setOpenCreateTeam(false);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });
};

export const useUpdateTeamNameForm = (selectedRestaurantAuth: Restaurant | undefined, selectedRestaurant: string | undefined) => {
    return useFormik({
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
                });
        }
    });
};

export const useInviteMemberForm = (selectedRestaurant: string | undefined, setInviteError: React.Dispatch<React.SetStateAction<string | null>>) => {
    return useFormik({
        initialValues: {
            teamId: selectedRestaurant,
            username: '',
            role: 'member'
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            api.post('/teams/invite', values, { withCredentials: true })
                .then((response) => {
                    setInviteError(null);
                })
                .catch((error) => {
                    setInviteError("Failed to invite member. Please try again.");
                });
        },
    });
};