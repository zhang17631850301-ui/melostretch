import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface State {
  hasError: boolean;
}

interface Props {
  children?: React.ReactNode;
}

export class AppErrorBoundary extends React.Component<Props, State> {
  declare readonly props: Readonly<Props>;
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error('MeloStretch page error:', error);
  }

  render(): React.ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <section className="w-full max-w-md rounded-3xl border border-amber-200 bg-white p-7 text-center shadow-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-black text-slate-900">页面暂时没有正常加载</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">你的本机数据还在。请关闭浏览器自动翻译后刷新页面；如果仍有问题，可以稍后再试。</p>
          <button onClick={() => window.location.reload()} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-bold text-white hover:bg-sky-700">
            <RefreshCw className="h-4 w-4" /> 重新加载
          </button>
        </section>
      </main>
    );
  }
}
