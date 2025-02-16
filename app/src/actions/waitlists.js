"use server";

import { getAccessToken } from "@/actions/auth";

export async function getWaitListsList(isServer = false) {
    const { success, accessToken } = await getAccessToken(isServer);
    if (!success) {
        return {
            success: false,
            error: "Failed to get access token",
        };
    }

    const resp = await fetch(`${process.env.DJANGO_API_URL}/api/waitlists`, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await resp.json();

    const obj = {
        success: resp.ok,
    };
    if (resp.ok) {
        obj.waitlists = data;
    }
    return obj;
}
