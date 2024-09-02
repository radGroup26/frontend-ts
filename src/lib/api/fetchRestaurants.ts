import { Restaurant } from "@/types/retaurant";
import api from "./api";

export default async function fetchRestaurants() {
    const response = await api.get('/teams', { withCredentials: true })

    if (response.status != 200) {
        throw new Error('Failed to fetch restaurants');
    }

    const ownerTeams = response.data.ownerTeams;
    const memberTeams = response.data.memberTeams;

    const teams: Restaurant[] = [
        ...ownerTeams.map((team: any) => ({ ...team, type: 'owner' })),
        ...memberTeams.map((team: any) => ({ ...team, type: 'member' }))
    ];

    return teams;
}