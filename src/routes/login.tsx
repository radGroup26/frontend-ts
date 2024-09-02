import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
    const { toast } = useToast();
    const { login } = useAuth();

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
                }
            };

            api.post('/auth', data, config)
                .then((response) => {
                    const accessToken = response.data.accessToken;
                    localStorage.setItem('accessToken', accessToken);
                    login();

                    toast({
                        title: "Logged in."
                    })
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    });
    return (
        <div className="flex items-center justify-center min-h-screen text-gray-500 ">
            <div className="bg-white p-10 shadow-md rounded-2xl w-[450px] flex flex-col items-center">
                <Logo />
                <h1 className="my-8">Log in to continue</h1>
                <form onSubmit={form.handleSubmit}>
                    <div className="space-y-3">
                        {/* <Input placeholder="Name" /> */}
                        <Input value={form.values.username} onChange={form.handleChange} name="username" placeholder="Email" autoComplete="current-password" />
                        <Input value={form.values.password} onChange={form.handleChange} name="password" type="password" placeholder="Password" autoComplete="current-password"  />
                    </div>

                    <div className="mt-10 flex flex-col">
                        <Button type="submit" className="w-full">Continue</Button>
                        <Button variant="link" asChild>
                            <Link to="/register">Don't have an account? Register</Link>
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
        </div>
    );
}