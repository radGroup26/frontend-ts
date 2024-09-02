import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate, type ActionFunction } from 'react-router-dom'
import { useFormik } from 'formik';
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import api from "@/lib/api/api";

export default function Register() {
    const { toast } = useToast();
    const navigate = useNavigate();

    const form = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        onSubmit: values => {
            const data = JSON.stringify({
                username: values.username,
                password: values.password
            });

            let config = {
                headers: {
                    'Content-Type': 'application/json'
                },
            };

            axios.post('http://localhost:3000/users', data, config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    toast({
                        title: "Account created."
                    })
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    });
    return (
        <>
            <Toaster />
            <div className="flex items-center justify-center min-h-screen text-gray-500 ">
                <div className="bg-white p-10 shadow-md rounded-2xl w-[450px] flex flex-col items-center">
                    <Logo />
                    <h1 className="my-8">Register to continue</h1>
                    <form onSubmit={form.handleSubmit}>
                        <div className="space-y-3">
                            {/* <Input placeholder="Name" /> */}
                            <Input name="username" placeholder="Email" onChange={form.handleChange} value={form.values.username} />
                            <Input name="password" type="password" placeholder="Password" onChange={form.handleChange} value={form.values.password} />
                        </div>

                        <div className="mt-10 flex flex-col">
                            <Button type="submit" className="w-full">Continue</Button>
                            <Button variant="link" asChild>
                                <Link to="/login">Already have an account? Log in</Link>
                            </Button>
                        </div>

                        <div className="flex flex-col items-center mt-28">
                            <div className="flex gap-1 items-center">
                                <UserGroupIcon className="size-8" />
                                <p className={cn('font-[Righteous]', 'text-2xl')}>GROUP26</p>
                            </div>

                            <div className="mt-2">
                                <Button variant="link" className="text-gray-500">Privacy Policy</Button>
                                <span className="text-gray-500">·</span>
                                <Button variant="link" className="text-gray-500">Terms of Service</Button>
                            </div>


                            <p className="text-sm text-center mt-6">This site is protected by reCAPTCHA and the Google
                                <span className="text-blue-500"> Privacy Policy</span> and <span className="text-blue-500">Terms of Service</span> apply
                            </p>
                        </div>

                    </form>
                </div>
            </div></>
    );
}