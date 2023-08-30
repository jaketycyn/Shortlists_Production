interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmationModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  isOpen,
  setIsOpen,
}: ConfirmationModalProps) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70">
          <div className=" rounded bg-white p-5">
            <h2 className="pb-4 text-center text-2xl font-bold">{title}</h2>
            <p className="pb-4 text-center">{message}</p>
            <div className="flex justify-center space-x-4">
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white"
                onClick={() => {
                  onConfirm();
                  setIsOpen(false);
                }}
              >
                Confirm
              </button>
              <button
                className="rounded bg-red-500 px-4 py-2 text-white"
                onClick={() => {
                  onCancel();
                  setIsOpen(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmationModal;
