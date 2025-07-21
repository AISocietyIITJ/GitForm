'use client'
import { signInWithGithub } from "@/utils/actions";
import React from "react";

const Authform = () => {
    return (
        <form action={signInWithGithub}>
            <button
                className="flex items-center justify-center gap-3 mx-auto mt-4 bg-black text-white px-10 py-3 rounded-md hover:bg-neutral-800 transition text-center w-full max-w-sm cursor-pointer"
            >
                <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M12 0C5.37 0 0 5.373 0 12a12 12 0 008.21 11.385c.6.11.82-.26.82-.577v-2.234c-3.338.726-4.043-1.61-4.043-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.746.083-.73.083-.73 1.204.085 1.838 1.24 1.838 1.24 1.07 1.833 2.807 1.304 3.492.997.107-.776.42-1.305.763-1.605-2.665-.304-5.467-1.332-5.467-5.932 0-1.31.47-2.38 1.236-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.323 3.3 1.23a11.52 11.52 0 013.003-.404c1.02.005 2.048.138 3.004.404 2.29-1.553 3.296-1.23 3.296-1.23.654 1.652.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.48 5.922.43.372.823 1.102.823 2.222v3.293c0 .32.217.694.825.576A12.004 12.004 0 0024 12c0-6.627-5.373-12-12-12z"
                        clipRule="evenodd"
                    />
                </svg>
                Sign in with GitHub
            </button>
        </form>
    );
}

export default Authform;
