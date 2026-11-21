import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Global ErrorBoundary to prevent blank white screens on unexpected runtime errors.
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[App ErrorBoundary]', error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F3] dark:bg-[#0B0F19] px-5 py-10 text-[#080908] dark:text-[#F8FAFC]">
          <div className="w-full max-w-md rounded-3xl border border-[#E2E8F0] dark:border-white/10 bg-[#FFFFFF] dark:bg-[#161F30] p-7 text-center shadow-sm space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-wider uppercase text-[#6B1D2F] dark:text-[#F4B8C6]">
                System Notice
              </p>
              <h1 className="text-xl font-bold leading-snug break-keep">
                일시적인 화면 오류가 발생했습니다
              </h1>
              <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed break-keep">
                일부 데이터를 불러오는 중 예상치 못한 문제가 생겼습니다. 아래 버튼을 눌러 화면을 다시 불러와 주세요.
              </p>
            </div>
            <button
              type="button"
              onClick={this.handleReload}
              className="w-full rounded-2xl bg-[#6B1D2F] px-5 py-3 text-sm font-semibold text-[#FFFFFF] transition hover:bg-[#561524] active:scale-[0.99]"
            >
              화면 다시 불러오기
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
