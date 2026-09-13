type WalletOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function WalletOverlay({ isOpen, onClose }: WalletOverlayProps) {
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
      <iframe
        title="Wallet"
        src="https://courtneytech.xyz/pay/proxies?embed=1"
        className="w-full flex-1 border-0 bg-white"
      />
    </div>
  );
}
