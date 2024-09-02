import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api/api";
import fetchInvites from "@/lib/api/fetchInvites";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";

export default function Invites() {
    const queryClient = useQueryClient();

    const invites = useQuery({
        queryKey: ['invites'],
        queryFn: fetchInvites
    })

    const formik = useFormik({
        initialValues: {
            teamId: '',
        },
        onSubmit: (values) => {
            api.post('/teams/invites/accept', values, { withCredentials: true })
                .then((response) => {
                    console.log(response);
                    queryClient.invalidateQueries({
                        queryKey: ['invites']
                    });
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    });

    if (invites.isLoading) {
        return <div>Loading...</div>
    }

    const handleAcceptInvite = (teamId: string) => {
        formik.setFieldValue('teamId', teamId);
        formik.handleSubmit();
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Team ID</TableHead>
                        <TableHead>Team Name</TableHead>
                        <TableHead>Owner</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invites.data?.map((invite) => (
                        <TableRow key={invite.id}>
                            <TableCell className="font-medium">{invite.id}</TableCell>
                            <TableCell>{invite.name}</TableCell>
                            <TableCell>{invite.owner}</TableCell>
                            <TableCell>
                                <div className="flex gap-2 justify-end">
                                    <Button type="button" onClick={() => handleAcceptInvite(invite.id)}>Accept</Button>
                                    {/* <Button variant="destructive" >Decline</Button> */}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}