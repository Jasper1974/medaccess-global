"use client";

import { useState } from "react";
import { WechatQrModal } from "@/components/wechat/WechatQrModal";

export function CharityApplyPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="border border-gold/40 bg-gold-dim p-6 md:p-8">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-gold px-10 py-3 text-sm tracking-widest text-navy transition hover:bg-gold-light"
        >
          我申请
        </button>

        <p className="mt-4 text-xs leading-relaxed text-cream-dim">
          本平台不参与赠药审核，不承诺申请结果。具体资格与赠药方案以药厂官方为准。
        </p>
      </div>

      <WechatQrModal
        open={open}
        onClose={() => setOpen(false)}
        description="请加平台企业微信，上传资料，申请慈善赠药协助。"
      />
    </>
  );
}
