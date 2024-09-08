import { Member } from "@/types/member";
import api from "./api";

export default async function fetchMembers({ queryKey }: any) {
    const teamId = queryKey[1]._id;
    const response = await api.post('/teams/members', { teamId: teamId }, { withCredentials: true });

    if (response.status !== 200) {
        throw new Error('Failed to fetch members');
    }

    const members: Member[] = response.data.members;
    
    return members;
}