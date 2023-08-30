import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  duration?: number;
}

const ProgressToast: React.FC<ToastProps> = ({
  message,
  visible,
  duration = 1600,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (visible && progress < 100) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          const nextProgress = prevProgress + 100 * (10 / duration);
          return nextProgress > 100 ? 100 : nextProgress;
        });
      }, 10);
    }

    return () => {
      clearInterval(timer);
    };
  }, [visible, progress, duration]);

  useEffect(() => {
    if (!visible) {
      setProgress(0);
    }
  }, [visible]);
  return (
    <>
      {visible && (
        <div className="z-100 fixed m-4 w-5/6 rounded border-2 border-black bg-slate-700 p-4 text-white">
          <h2 className="pb-4 text-center text-2xl font-bold">{message}</h2>
          <div className="relative pt-1">
            <div className="mb-2 flex items-center justify-between">
              <div className="w-1/2">
                <span className="inline-block rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase text-green-700">
                  Task in Progress
                </span>
              </div>
              <div className="w-1/2 text-right">
                <span className="inline-block text-xs font-semibold text-white">
                  {Math.min(100, Math.floor(progress))}%
                </span>
              </div>
            </div>
            <div className="mb-4 flex h-2 w-full overflow-hidden rounded bg-white text-xs">
              <div
                style={{ width: `${progress}%` }}
                className="flex flex-col justify-center whitespace-nowrap bg-green-500 text-center text-green-400 shadow-none"
              ></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProgressToast;
