import { Invite } from "@/types/invite";
import api from "./api";

export default async function fetchInvites() {
    const response = await api.get('/teams/invites', { withCredentials: true });

    if (response.status !== 200) {
        throw new Error('Failed to fetch members');
    }

    const invites: Invite[] = response.data.teams;
    return invites
}