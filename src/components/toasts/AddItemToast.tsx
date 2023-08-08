type ToastProps = {
  message: string;
  isVisible: boolean;
};

export const AddItemToast: React.FC<ToastProps> = ({ message, isVisible }) => {
  return (
    <div
      className={`${
        isVisible ? "block" : "hidden"
      } fixed bottom-4 left-1/2 -translate-x-1/2 transform rounded-md bg-indigo-500 px-4 py-2 text-white shadow-lg`}
    >
      {message}
    </div>
  );
};

export default AddItemToast;
