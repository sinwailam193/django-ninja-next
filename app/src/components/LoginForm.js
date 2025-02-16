"use client";

import { login } from "@/actions/auth";

export default function LoginForm() {
    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get("username");
        const password = formData.get("password");

        const result = await login(username, password);
    }

    return (
        <form
            className="flex flex-col gap-2 text-black"
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                name="username"
                placeholder="Your username"
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Your password"
                required
            />
            <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-md"
            >
                Login
            </button>
        </form>
    );
}
