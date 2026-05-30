"use client";

import { useEffect } from "react";

interface WechatQrModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description: string;
}

export function WechatQrModal({
  open,
  onClose,
  title = "申请协助",
  description,
}: WechatQrModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wechat-modal-title"
        className="relative w-full max-w-sm border border-cream-faint bg-navy-mid p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-cream-dim transition hover:text-cream"
          aria-label="关闭"
        >
          ✕
        </button>

        <div className="text-center">
          <div id="wechat-modal-title" className="text-xs tracking-[0.2em] text-gold">
            // {title}
          </div>
          <p className="mt-4 text-base leading-relaxed text-cream">{description}</p>

          <div className="mx-auto mt-6 flex h-44 w-44 items-center justify-center border border-dashed border-cream-faint bg-navy text-center text-xs leading-relaxed text-cream-dim">
            请替换为
            <br />
            平台企业微信
            <br />
            二维码
          </div>

          <p className="mt-6 text-xs text-cream-dim">
            长按识别二维码，添加后即可上传资料
          </p>
        </div>
      </div>
    </div>
  );
}
