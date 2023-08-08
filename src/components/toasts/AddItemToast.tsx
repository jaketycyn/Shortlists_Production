type ToastProps = {
  message: string;
  isVisible: boolean;
};

export const AddItemToast: React.FC<ToastProps> = ({ message, isVisible }) => {
  return (
    <div
      className={`${
        isVisible ? "block" : "hidden"
      } fixed left-1/2  mt-6 -translate-x-1/2 transform rounded-md bg-green-500 px-4 py-2 text-white shadow-lg`}
    >
      {message}
    </div>
  );
};

export default AddItemToast;
