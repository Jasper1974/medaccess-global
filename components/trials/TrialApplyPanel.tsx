"use client";

import { useState } from "react";
import { WechatQrModal } from "@/components/wechat/WechatQrModal";

export function TrialApplyPanel() {
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
          本平台不提供诊断意见，不承诺入组结果。最终入组须以研究中心审核为准。
        </p>
      </div>

      <WechatQrModal
        open={open}
        onClose={() => setOpen(false)}
        description="请加平台企业微信，上传资料，验证进组资格。"
      />
    </>
  );
}
