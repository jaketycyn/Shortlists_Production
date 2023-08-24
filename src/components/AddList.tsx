import React from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { useForm, Resolver } from "react-hook-form";

import { trpc } from "../utils/trpc";
import { type AddListSchema } from "../server/schema/listSchema";

import { HiX, HiOutlineCheck, HiPlus } from "react-icons/hi";

const resolver: Resolver<AddListSchema> = async (values) => {
  return {
    values: !values.listTitle ? {} : values,
    errors: !values.listTitle
      ? {
          listTitle: {
            type: "required",
            message: "A title is required",
          },
        }
      : {},
  };
};

const AddList: NextPage = () => {
  const [showToast, setShowToast] = React.useState<boolean>(false);
  const {
    handleSubmit,
    register,
    // reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<AddListSchema>({
    defaultValues: {
      listTitle: "",
    },
    resolver,
  });

  const { mutateAsync } = trpc.userList.addList.useMutation();

  const router = useRouter();

  //TODO: custom callback hook to prevent double Submission

  const onSubmit = async (data: AddListSchema) => {
    try {
      console.log("onsubmit fired: ");
      const result = await mutateAsync(data);
      console.log("result: ", result);
      console.log("resultID: ", result.result.id);
      if (result) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          router.push(`/lists/${result.result.id}`);
        }, 1000);
      }
      console.log("result: ", result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mb-20 flex h-full flex-grow-0 items-center justify-center border-t-2 border-blue-400 bg-slate-200 shadow-xl ">
      <form
        className="items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Form Component: Start*/}
        <div className="relative mt-2 h-full">
          <div className="flex flex-col items-center">
            {/* Toast: Start*/}
            {showToast ? (
              <div
                id="toast-simple"
                className="flex h-14 w-60 items-center space-x-4 divide-x divide-gray-200 rounded-lg bg-green-400 p-4 text-black shadow"
                role="alert"
              >
                <HiPlus />
                <div className="pl-6 font-normal">List Created</div>
              </div>
            ) : (
              <div></div>
            )}

            {/* Toast: End */}
            {/* {errors?.listTitle && (
              <p className="inline font-bold text-red-800">
                ⚠{errors.listTitle.message}
              </p>
            )} */}
            <div // controls opacity of rest of active list when add item/list is selected
              className="container relative mx-auto flex h-full flex-row  p-6 px-4 pb-8 "
            >
              <input
                autoComplete="off"
                className="flex h-20 w-full border-2 border-black text-center text-black"
                placeholder="Enter List Name"
                {...register("listTitle")}
              />
            </div>
          </div>
        </div>
        {/* Form Component: End*/}
      </form>
    </div>
  );
};

export default AddList;
