import api from "./api";

export default async function fetchRestaurants({ queryKey }: { queryKey: any }) {
    const teamId = queryKey[1];
    const response = await api.post('/teams/role', { teamId: teamId }, { withCredentials: true })

    if (response.status != 200) {
        throw new Error('Failed to fetch role');
    }

    const role: string = response.data.role;

    return role
}