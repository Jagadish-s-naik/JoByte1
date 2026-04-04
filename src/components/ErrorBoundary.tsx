import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: (error: Error) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!);
      }
      return (
        <div className="absolute inset-0 z-[999] bg-black text-red-500 p-8 flex flex-col items-center justify-center font-mono">
          <h2 className="text-3xl font-bold mb-4">React Render Crash Detected</h2>
          <pre className="bg-neutral-900 p-6 rounded-xl border border-red-500/30 max-w-4xl overflow-auto w-full text-left">
            {this.state.error?.stack || this.state.error?.message}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
