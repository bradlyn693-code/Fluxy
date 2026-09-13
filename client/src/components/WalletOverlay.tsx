import { useEffect, useState } from "react";

type WalletOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function WalletOverlay({ isOpen, onClose }: WalletOverlayProps) {
  const [frameLoaded, setFrameLoaded] = useState(false);

  useEffect(() => {
    if (!isOpen) setFrameLoaded(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex animate-in slide-in-from-right flex-col bg-[#0A1120] duration-300">
      <div className="flex h-14 shrink-0 items-center gap-3 px-4">
        <button
          onClick={onClose}
          aria-label="Close Wallet"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E304F]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <p className="font-semibold text-white">Wallet</p>
      </div>
      <div className="relative flex min-h-0 flex-1 overflow-hidden bg-[#0A1120]">
        {!frameLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0A1120] text-cyan-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_18px_#00ffff]" />
            <span className="font-mono text-[10px] tracking-[.22em]">CONNECTING TO SECURE WALLET</span>
          </div>
        )}
        <iframe
          title="Wallet"
          src="https://courtneytech.xyz/pay/proxies?embed=1"
          loading="eager"
          onLoad={() => setFrameLoaded(true)}
          className={`h-full w-full flex-1 border-0 bg-[#0A1120] transition-opacity duration-200 ${frameLoaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </div>
  );
}
