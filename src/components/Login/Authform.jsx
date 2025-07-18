'use client'
import { signInWithGithub } from "@/utils/actions";
import React from "react";

const Authform = () => {
    return (
        <div className="block mx-auto mt-4 bg-black text-white px-6 py-2 rounded-md hover:bg-neutral-800 transition text-center">
            <form action={signInWithGithub}>
                <button>
                    Sign in with GitHub
                </button>
            </form>
        </div>

    );
    }

export default Authform;