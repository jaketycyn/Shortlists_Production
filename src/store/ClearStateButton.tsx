import React from "react";
import { persistor } from "./store";

const ClearStateButton = () => {
  const handleClearState = async () => {
    await persistor.purge();
  };

  return (
    <div className="m-20">
      <button onClick={handleClearState}>Clear Persisted State</button>;
    </div>
  );
};

export default ClearStateButton;
