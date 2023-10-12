import React from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { useForm, Resolver } from "react-hook-form";

import { trpc } from "../utils/trpc";

import { HiX, HiOutlineCheck, HiPlus } from "react-icons/hi";
import { type AddItemSchema } from "../server/schema/itemSchema";
import { useDispatch, useSelector } from "react-redux";
import { setListsLoading } from "../slices/listSlice";

interface AddItemProps {
  listId: string;
}

const resolver: Resolver<AddItemSchema> = async (values) => {
  return {
    values: !values.itemTitle ? {} : values,
    errors: !values.itemTitle
      ? {
          itemTitle: {
            type: "required",
            message: "A title is required",
          },
        }
      : {},
  };
};

const AddItem: NextPage<AddItemProps> = ({ listId }) => {
  const [showToast, setShowToast] = React.useState<boolean>(false);
  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<AddItemSchema>({
    defaultValues: {
      itemTitle: "",
    },
    resolver,
  });

  console.log("listId: ", listId);

  const { mutateAsync } = trpc.userItem.addItem.useMutation();

  //TODO: custom callback hook to prevent double Submission

  const onSubmit = async (data: AddItemSchema) => {
    try {
      // console.log("onsubmit fired: ");
      console.log("data: ", data);

      //  const result = await mutateAsync(data);
      const result = await mutateAsync({ ...data, listId: listId });
      // console.log("result: ", result);
      // console.log("resultID: ", result.result.id);
      if (result) {
        setShowToast(true);
        dispatch(setListsLoading(true));
        setTimeout(() => {
          setShowToast(false);
          //trigger rerender
          reset({ itemTitle: "" });
          refetch();
        }, 1000);
      }
      console.log("result: ", result);
    } catch (err) {
      console.error(err);
    }
  };

  const { refetch } = trpc.userItem.getItemsByListId.useQuery({
    listId: [listId],
  });

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
                className="fixed bottom-1/4  z-50 mt-4 flex h-14 w-60 items-center space-x-4 divide-x divide-gray-200 rounded-lg bg-green-400 p-4 text-black shadow"
                role="alert"
              >
                <HiPlus />
                <div className="pl-6 font-normal">Item Added</div>
              </div>
            ) : (
              <div></div>
            )}

            {/* Toast: End */}
            {/* {errors?.itemTitle && (
              <p className="inline font-bold text-red-800">
                ⚠{errors.itemTitle.message}
              </p>
            )} */}
            <div // controls opacity of rest of active list when add item/list is selected
              className="container relative mx-auto flex h-full flex-row  p-6 px-4 pb-8 "
            >
              <input
                autoComplete="off"
                className="flex h-20 w-full border-2 border-black text-center text-black"
                placeholder="Item name"
                {...register("itemTitle")}
              />
            </div>
          </div>
        </div>
        {/* Form Component: End*/}
      </form>
    </div>
  );
};

export default AddItem;
