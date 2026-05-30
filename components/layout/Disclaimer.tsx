export function Disclaimer() {
  return (
    <div className="flex items-start gap-3 border-y border-cream-faint bg-navy-mid px-6 py-4 md:px-14">
      <span className="shrink-0 text-xs tracking-widest text-gold">[ 声明 ]</span>
      <p className="text-sm leading-relaxed text-cream-dim">
        本平台提供医疗信息检索与资源匹配服务，不提供诊断意见，不直接销售药品。
        所有用药建议须经具备资质的医师确认。浏览模式下展示公开信息；专属方案需基于上传资料并经审核后提供。
      </p>
    </div>
  );
}
