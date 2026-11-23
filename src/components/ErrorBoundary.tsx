import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: '',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Ocurrió un error inesperado.',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F9FD] text-[#0B2239] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-[#C5DCF2] p-8 rounded-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0B5394]">
              Meridiano Sur
            </p>
            <h1 className="mt-2 font-serif text-3xl font-medium text-[#0B2239]">
              Hubo un inconveniente al cargar tu archivo
            </h1>
            <p className="mt-3 text-sm text-[#3A546E] leading-relaxed">
              Podés recargar la página para restablecer la conexión con tu cuenta cultural.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 px-5 py-2.5 text-xs font-semibold bg-[#0B5394] text-white rounded-md hover:bg-[#083D6E] transition-colors cursor-pointer"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
