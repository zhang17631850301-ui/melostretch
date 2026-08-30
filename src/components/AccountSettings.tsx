import React, { useState } from 'react';
import { Check, Cloud, Loader2, LogIn, LogOut, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export const AccountSettings: React.FC = () => {
  const { user, loading, syncing, syncError, sendLoginLink, signOut, retrySync } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setMessage('');
    try {
      await sendLoginLink(email);
      setSent(true);
    } catch (error: any) {
      setMessage(error?.message || '登录邮件发送失败，请稍后重试');
    } finally {
      setSending(false);
    }
  };

  const handleSignOut = async () => {
    setMessage('');
    try {
      await signOut();
      setIsOpen(false);
    } catch (error: any) {
      setMessage(error?.message || '退出失败，请稍后重试');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2.5 rounded-xl border transition-all relative ${user ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
        title={user ? `已登录：${user.email}` : '登录并跨设备同步'}
      >
        {loading || syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : user ? <Cloud className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
        {user && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-sky-500" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[110] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-sky-100 p-6" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="font-black text-gray-900">账号与跨设备同步</h2>
                <p className="text-xs text-gray-500 mt-1">同步收藏、AI动作与练习记录</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200"><X className="w-4 h-4" /></button>
            </div>

            {user ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-sky-50 border border-sky-100 p-4">
                  <div className="flex items-center gap-2 text-sky-800 font-bold text-sm"><Check className="w-4 h-4" /> 已登录并启用云同步</div>
                  <p className="mt-2 text-xs text-gray-600 break-all">{user.email}</p>
                </div>
                {syncing && <p className="text-xs text-sky-700 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> 正在同步数据…</p>}
                {syncError && (
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                    <p>{syncError}</p>
                    <button onClick={() => void retrySync()} className="mt-2 font-bold inline-flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> 重新同步</button>
                  </div>
                )}
                <p className="text-xs leading-relaxed text-gray-500">Gemini API Key不会上传云端；换设备后需要重新填写一次。</p>
                <button onClick={() => void handleSignOut()} className="w-full py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold flex items-center justify-center gap-2"><LogOut className="w-4 h-4" /> 退出登录</button>
              </div>
            ) : sent ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5 text-center">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-gray-900 mt-3">登录邮件已发送</h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">请在同一设备打开邮件中的登录链接。第一次登录会自动创建账号并上传本机数据。</p>
                <button onClick={() => setSent(false)} className="mt-4 text-xs font-bold text-emerald-700">换一个邮箱</button>
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-4">
                <div className="rounded-2xl bg-sky-50 border border-sky-100 p-3 text-xs text-sky-900 leading-relaxed">无需设置密码。输入邮箱后，我们会发送一次性安全登录链接。</div>
                <div>
                  <label className="text-xs font-bold text-gray-700" htmlFor="login-email">邮箱地址</label>
                  <input id="login-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" autoComplete="email" className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
                </div>
                {message && <p className="text-xs text-rose-600">{message}</p>}
                <button disabled={sending || !email.trim()} className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:bg-gray-300 text-white text-sm font-bold flex items-center justify-center gap-2">{sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />} 发送登录链接</button>
                <p className="text-[11px] text-center text-gray-400">不登录也可以继续使用，数据会留在当前浏览器。</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
