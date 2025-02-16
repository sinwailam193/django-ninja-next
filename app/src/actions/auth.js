"use server";

import { cookies } from "next/headers";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/const";

async function setTokens(accessToken, refreshToken) {
    const cookieStore = await cookies();
    cookieStore.set({
        name: ACCESS_TOKEN,
        value: accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 300, // 5 minutes in seconds (5 * 60)
    });
    cookieStore.set({
        name: REFRESH_TOKEN,
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 604800, // 7 days in seconds (7 * 24 * 60 * 60)
    });
}

export async function deleteTokens() {
    const cookieStore = await cookies();
    cookieStore.delete(ACCESS_TOKEN);
    cookieStore.delete(REFRESH_TOKEN);
}

async function refreshToken(isServer = false) {
    const cookieStore = await cookies();
    if (!cookieStore.has(REFRESH_TOKEN)) {
        return {
            success: false,
            error: "No refresh token found",
        };
    }
    const refreshToken = cookieStore.get(REFRESH_TOKEN);

    const resp = await fetch(
        `${process.env.DJANGO_API_URL}/api/token/refresh`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken.value }),
        }
    );
    const data = await resp.json();

    if (resp.ok && !isServer) {
        await setTokens(data.access, data.refresh);
    }

    return {
        success: resp.ok,
        accessToken: data.access,
        refreshToken: data.refresh,
    };
}

export async function getAccessToken(isServer = false) {
    const cookieStore = await cookies();
    let accessToken = null;
    if (!cookieStore.has(ACCESS_TOKEN)) {
        const { success, accessToken: newAccessToken } = await refreshToken(
            isServer
        );
        if (!success) {
            return {
                success: false,
                error: "Failed to refresh token",
            };
        }
        accessToken = newAccessToken;
    } else {
        accessToken = cookieStore.get(ACCESS_TOKEN).value;
    }

    return {
        success: true,
        accessToken,
    };
}

export async function login(username, password) {
    const resp = await fetch(`${process.env.DJANGO_API_URL}/api/token/pair`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });
    const data = await resp.json();
    if (resp.ok) {
        await setTokens(data.access, data.refresh);
    }

    return {
        success: resp.ok,
    };
}
