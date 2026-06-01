import Link from "next/link";
import type { HkmoCatalogRecord } from "@/types/catalog";

const TYPE_LABEL = { drug: "药品", device: "医疗器械" } as const;
const STATUS_LABEL = { active: "目录内", discontinued: "已调整" } as const;

interface HkmoTableProps {
  items: HkmoCatalogRecord[];
  diseaseSlug: string;
}

export function HkmoTable({ items, diseaseSlug }: HkmoTableProps) {
  if (items.length === 0) {
    return (
      <div className="mt-8 border border-cream-faint bg-navy-mid p-8 text-center text-cream-dim">
        该病种下暂无收录的港澳药械通目录品种。
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto border border-cream-faint">
      <table className="w-full min-w-[960px] border-collapse text-left text-sm">
        <thead className="bg-navy-light text-xs tracking-wider text-cream-dim">
          <tr>
            <th className="border-b border-r border-cream-faint px-3 py-3">名称</th>
            <th className="border-b border-r border-cream-faint px-3 py-3">类型</th>
            <th className="border-b border-r border-cream-faint px-3 py-3">剂型</th>
            <th className="border-b border-r border-cream-faint px-3 py-3">适应症</th>
            <th className="border-b border-r border-cream-faint px-3 py-3">目录批次</th>
            <th className="border-b border-r border-cream-faint px-3 py-3">状态</th>
            <th className="border-b border-cream-faint px-3 py-3">操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item.id}
              className={`transition hover:bg-navy-light ${
                index % 2 === 0 ? "bg-navy-mid/40" : "bg-navy/40"
              }`}
            >
              <td className="border-b border-r border-cream-faint px-3 py-3 text-cream">
                <div>{item.name}</div>
                {item.nameEn ? (
                  <div className="mt-1 text-xs text-cream-dim">{item.nameEn}</div>
                ) : null}
              </td>
              <td className="border-b border-r border-cream-faint px-3 py-3 text-cream-dim">
                {TYPE_LABEL[item.productType]}
              </td>
              <td className="border-b border-r border-cream-faint px-3 py-3 text-cream-dim">
                {item.dosageForm ?? "—"}
              </td>
              <td className="border-b border-r border-cream-faint px-3 py-3 text-cream-dim">
                {item.diseaseLabel}
              </td>
              <td className="border-b border-r border-cream-faint px-3 py-3 text-cream-dim">
                {item.hkmoBatch ?? "—"}
              </td>
              <td className="border-b border-r border-cream-faint px-3 py-3">
                <span className="border border-teal/40 bg-teal-dim px-2 py-0.5 text-[11px] text-teal">
                  {STATUS_LABEL[item.status]}
                </span>
              </td>
              <td className="border-b border-cream-faint px-3 py-3">
                <Link
                  href={`/d/${diseaseSlug}/hkmo/${item.id}`}
                  className="text-gold transition hover:text-gold-light"
                >
                  详情
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
