import type { NextPage } from "next";
//import { useSession } from "next-auth/react";
import Link from "next/link";
import FooterNav from "../../navigation/FooterNav";

const ProfilePageLayout: NextPage = () => {
  return (
    <>
      <div className="flex h-screen flex-col justify-between">
        {/* Header Nav: Start */}
        <header className="border-grey z-80 sticky top-0 grid h-14 w-full grid-cols-8 grid-rows-1 border-b p-4 text-center">
          {/* Back button - Home page link */}
          <div className="col-start-1 row-start-1">
            <Link href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                />
              </svg>
            </Link>
          </div>
          {/* List Title */}
          <div className="col-span-2 col-start-3 row-start-1 w-full items-center justify-between text-center">
            Profile Page
          </div>
          {/* Share Form Link */}
          <div className="col-start-7 row-start-1 flex flex-col items-end">
            <Link
              href="/share"
              //onClick={() => dispatch(setActiveItems(*all items attached to active list))}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
            </Link>
          </div>
          {/* Options */}
          <div className="col-start-8 row-start-1 flex flex-col items-end">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
              onClick={() => console.log("options")}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
              />
            </svg>
          </div>
        </header>
        {/* Profile Section */}
        <div>
          <p>Profile Picture</p>

          <p>Profile Picture</p>
        </div>
        <div>
          <FooterNav />
        </div>
      </div>
    </>
  );
};

export default ProfilePageLayout;