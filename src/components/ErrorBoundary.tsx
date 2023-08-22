import React, { ErrorInfo } from "react";
import { connect } from "react-redux";
import { withRouter, NextRouter } from "next/router";
import { setError, clearError } from "../slices/errorSlice";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  router: NextRouter;
  hasError: boolean;
  setError: () => void;
  clearError: () => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log("Setting Error True");
    this.props.setError();
    console.log({ error, errorInfo });
  }

  render() {
    const { router, clearError, hasError } = this.props;
    // Check if the error is thrown
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-blue-500">
          <div className="rounded-lg bg-white p-4 shadow">
            <h2 className="text-2xl font-bold text-blue-500">
              Oops, there is an error!
            </h2>
            <button
              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              type="button"
              onClick={async () => {
                console.log("Clearing Error and navigating home");
                clearError();
                await router.push("/");
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

const mapStateToProps = (state: any) => ({
  hasError: state.error.hasError,
});

const mapDispatchToProps = {
  setError,
  clearError,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary)
);
