import React, { ErrorInfo } from "react";
import { withRouter, NextRouter } from "next/router";
import FooterNav from "./navigation/FooterNav";

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  router: NextRouter;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    // Define a state variable to track whether there is an error or not
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }

  render(): React.ReactNode {
    const { router } = this.props;
    // Check if the error is thrown
    if (this.state.hasError) {
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
              onClick={() => {
                this.setState({ hasError: false }, () => {
                  router.push("/"); // Navigate back to home
                });
              }}
            >
              Back to Home
            </button>
          </div>
          <FooterNav />
        </div>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
