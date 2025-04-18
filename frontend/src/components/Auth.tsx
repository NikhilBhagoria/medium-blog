import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { SignupInput } from "@nikhilbhagoria/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        username: "",
        password: ""
    }); // change the name of username to email

    async function sendRequest(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, { name: postInputs.name, username: postInputs.username, password: postInputs.password });
            const token = response.data.token;
            const user = response.data.user;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/blogs");
        } catch (e: any) {
            console.log("ee",e);
            setError(e.response.data.message)
            // alert the user here that the request failed
        } finally {
            setIsLoading(false);
        }
    }

    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="px-10">
                    <div className="text-3xl font-extrabold">
                        {type === "signin" ? "Login Account" : "Create an Account"}
                    </div>
                    <div className="text-slate-500">
                        {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                        <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </div>
                </div>
                <div className="pt-8">
                    <form onSubmit={sendRequest}>
                    {type === "signup" ? <LabelledInput label="Name" placeholder="Name..." value={postInputs.name} onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            name: e.target.value
                        })
                    }} /> : null}
                    <LabelledInput label="Username" placeholder="Username..." value={postInputs.username} onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            username: e.target.value
                        })
                    }} />
                    <LabelledInput label="Password" type={"password"} placeholder="Password..." value={postInputs.password} onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }} />
                    {error && <div className="text-red-500">{error}</div>}
                    <button disabled={isLoading} type="submit" className={`mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>{isLoading ? "Loading..." : type === "signup" ? "Sign up" : "Sign in"}</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    value?: string;
}

function LabelledInput({ label, placeholder, onChange, type, value }: LabelledInputType) {
    return <div>
        <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
        <input onChange={onChange} value={value} type={type || "text"} id={`first_${label}`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>
}