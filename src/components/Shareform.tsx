import React, { useState, useCallback } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAppSelector } from "../hooks/useTypedSelector";

import { useForm, Resolver, SubmitHandler } from "react-hook-form";

import { trpc } from "../utils/trpc";
import { type ShareListSchema } from "../server/schema/listSchema";

import { HiX, HiOutlineCheck, HiPlus } from "react-icons/hi";

// need to change schema since i'm not including targetEmail now
const resolver: Resolver<any> = async (values) => {
  return {
    values: !values.targetEmail ? {} : values,
    errors: !values.targetEmail
      ? {
          targetEmail: {
            type: "required",
            message: "An email is required",
          },
        }
      : {},
  };
};

const Shareform: NextPage = () => {
  const [showToast, setShowToast] = React.useState<boolean>(false);
  const { activeList, error, loading } = useAppSelector((state) => state.list);
  const { items } = useAppSelector((state) => state.item);

  const {
    handleSubmit,
    register,
    // reset,
    formState: { errors },
  } = useForm<ShareListSchema>({
    resolver,
  });

  // swap with Share list TRPC
  const { mutateAsync } = trpc.userList.shareList.useMutation();
  const router = useRouter();

  const onSubmit = useCallback(
    async (data: ShareListSchema) => {
      try {
        // if (data) {
        //   console.log("data found on sharing: ", data);
        // }
        //hardcode pass info via Redux

        data.listId = activeList!.id;
        data.listTitle = activeList!.title;
        data.userId = activeList!.userId;

        if (items) {
          //filter out archived/trash items so they aren't sent/copied over
          const filteredItems = items.filter(
            (i) => i.archive === "archive" || i.archive === "trash"
          );
          console.log("filteredItems: ", filteredItems);

          //!Disabled for now but will need to redo later when sharing items
          // data.items = filteredItems;
          // console.log("data.items: ", data.items);
          const result = await mutateAsync(data);
          console.log("result in Onsubmit share form: ", result);
          if (result) {
            setShowToast(true);
            setTimeout(() => {
              setShowToast(false);
            }, 1000);
          }
        } else {
          const result = await mutateAsync(data);
          console.log("result in Onsubmit share form: ", result);
          if (result) {
            setShowToast(true);
            setTimeout(() => {
              setShowToast(false);
            }, 1000);
          }

          //redirection if needed
          // setTimeout(() => {
          //   router.push("/");
          // }, 500);
        }
        //setShowToast(false);
      } catch (err) {
        console.error(err);
      }
    },
    [mutateAsync, router]
  );

  // const onSubmit: SubmitHandler<ListFormInputs> = (data) => {
  //   console.log("data: ", data);

  //   if (data) {
  //     setShowToast(true);
  //     return {
  //       redirect: {},
  //     };
  //   }
  // };

  return (
    <div className="h-full">
      <form
        className="items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Setup Grid - layout later for spacing of Back, list name, share icon & more options icon w/ redirect to options page like Notion*/}
        <header className="border-grey sticky top-0 grid w-full grid-rows-1 border-b p-4 text-center">
          {/* This should redirect to previous page (historical page) not "/"  */}
          <Link href="/" className="row-start-1">
            <HiX className="ml-2 mt-1 h-4 w-4" />
          </Link>
          <div className="row-start-1">Share List</div>
          <div className="row-start-1">
            <button>
              {/* 
            1. Fire Submission of List
            2. Pop Up Toast saying incomplete items if rquired fields in form not fired
            3?. Possible change link from homepage ('/') to the list itself but thats a finer tuning point
            */}
              <HiOutlineCheck className="mr-2 mt-1 h-4 w-4" />
            </button>
          </div>
        </header>
        {/* Form Component: Start*/}
        <div
          className="relative mt-2 h-full"
          //onClick={() => setAddItemOrList(false)}
        >
          <div className="flex flex-col items-center">
            {/* {errors?.targetEmail && (
              <p className="inline font-bold text-red-800">
                ⚠{errors.targetEmail.message}
              </p>
            )} */}
            <div // controls opacity of rest of active list when add item/list is selected
              className="container relative mx-auto flex h-full flex-col  p-6 px-4 pb-8 "
            >
              {/* Toast: Start*/}
              <div className="mb-4 flex flex-col items-center space-x-4 ">
                {showToast ? (
                  <div
                    id="toast-simple"
                    className="flex h-14 w-60 items-center divide-x  divide-black  rounded-lg bg-green-500 pl-4 text-black shadow"
                  >
                    <HiPlus className="mr-1" />
                    <div className="pl-10 font-normal">List Shared</div>
                  </div>
                ) : (
                  <div className="flex h-14 w-60 flex-col items-center  rounded-lg">
                    <h1 className="mt-2 text-2xl font-bold">
                      {activeList!.title}
                    </h1>
                  </div>
                )}
              </div>

              {/* Toast: End */}
              <input
                autoFocus
                autoComplete="off"
                className="flex h-20 w-full border-2 border-black text-center text-black"
                placeholder="Enter friend's email..."
                onFocus={() => setShowToast(false)}
                // {...register("targetEmail")}
              />
            </div>
          </div>
        </div>
        {/* Form Component: End*/}
      </form>
    </div>
  );
};

export default Shareform;
