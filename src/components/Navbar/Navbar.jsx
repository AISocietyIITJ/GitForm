import { signOut } from "@/utils/actions";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

const Navbar = async () => {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();

  console.log(session);


  return (
    <div className="navbar bg-black text-white px-6 py-3 border-b border-gray-200">
      {/* Left: Brand */}
      <div className="flex-1">
        <a className="text-xl normal-case">Raid X Pathway</a>
      </div>

      {/* Right: Avatar with dropdown */}
      <div className="flex items-center">
        
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img
              alt={session.user.user_metadata.full_name || "User"}
              src={session.user.user_metadata.avatar_url} />
          </div>
        </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] w-52 p-2 shadow bg-base-100 rounded-box text-black"
          >
            <li>
              <button onClick={signOut} className="w-full text-left">
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
