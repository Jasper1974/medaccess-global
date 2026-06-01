"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getCharityFilterOptions } from "@/lib/charity";
import type { CharityProgramRecord } from "@/types/charity";

interface CharityTableProps {
  programs: CharityProgramRecord[];
  diseaseSlug: string;
}

type FilterKey =
  | "company"
  | "drugName"
  | "disease"
  | "benefit"
  | "crawledAt"
  | "status";

const STATUS_LABEL: Record<CharityProgramRecord["status"], string> = {
  active: "进行中",
  closed: "已结束",
};

function formatDate(value: string): string {
  if (!value) return "—";
  return value.replace(/-/g, "/");
}

function ColumnFilterButton({
  label,
  active,
  open,
  onToggle,
  children,
}: {
  label: string;
  active: boolean;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <th className="relative border-b border-r border-cream-faint px-2 py-2 font-normal">
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-1 px-1 py-1 text-left transition hover:text-gold ${
          active ? "text-gold" : "text-cream-dim"
        }`}
      >
        <span>{label}</span>
        <span className="text-[10px] opacity-70">{open ? "▲" : "▼"}</span>
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-20 min-w-[200px] border border-cream-faint bg-navy p-3 shadow-xl">
          {children}
        </div>
      ) : null}
    </th>
  );
}

export function CharityTable({ programs, diseaseSlug }: CharityTableProps) {
  const options = useMemo(() => getCharityFilterOptions(programs), [programs]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [keyword, setKeyword] = useState("");
  const [company, setCompany] = useState("");
  const [diseaseLabel, setDiseaseLabel] = useState("");
  const [benefit, setBenefit] = useState("");
  const [status, setStatus] = useState("");
  const [crawledAfter, setCrawledAfter] = useState("");

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpenFilter(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = useMemo(() => {
    return programs.filter((program) => {
      if (keyword) {
        const q = keyword.toLowerCase();
        const haystack = [program.drugName, program.indication, program.company]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (company && program.company !== company) return false;
      if (diseaseLabel && program.diseaseLabel !== diseaseLabel) return false;
      if (benefit && program.benefit !== benefit) return false;
      if (status && program.status !== status) return false;
      if (crawledAfter && program.crawledAt < crawledAfter) return false;
      return true;
    });
  }, [programs, keyword, company, diseaseLabel, benefit, status, crawledAfter]);

  function toggleFilter(key: FilterKey) {
    setOpenFilter((prev) => (prev === key ? null : key));
  }

  function clearColumn(key: FilterKey) {
    switch (key) {
      case "company":
        setCompany("");
        break;
      case "drugName":
        setKeyword("");
        break;
      case "disease":
        setDiseaseLabel("");
        break;
      case "benefit":
        setBenefit("");
        break;
      case "crawledAt":
        setCrawledAfter("");
        break;
      case "status":
        setStatus("");
        break;
    }
  }

  const inputClass =
    "w-full border border-cream-faint bg-navy px-2 py-1.5 text-xs text-cream outline-none focus:border-gold";

  return (
    <div ref={containerRef} className="mt-8">
      <div className="mb-3 text-xs text-cream-dim">
        共 {programs.length} 条，当前显示 {filtered.length} 条 · 点击列标题筛选
      </div>

      <div className="overflow-x-auto border border-cream-faint">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="bg-navy-light text-xs tracking-wider">
            <tr>
              <ColumnFilterButton
                label="药厂"
                active={!!company}
                open={openFilter === "company"}
                onToggle={() => toggleFilter("company")}
              >
                <div className="space-y-2">
                  <select
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">全部药厂</option>
                    {options.companies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => clearColumn("company")}
                    className="text-xs text-gold"
                  >
                    清除
                  </button>
                </div>
              </ColumnFilterButton>

              <ColumnFilterButton
                label="项目名称"
                active={!!keyword}
                open={openFilter === "drugName"}
                onToggle={() => toggleFilter("drugName")}
              >
                <div className="space-y-2">
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="搜索项目或适应症"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => clearColumn("drugName")}
                    className="text-xs text-gold"
                  >
                    清除
                  </button>
                </div>
              </ColumnFilterButton>

              <ColumnFilterButton
                label="适应症"
                active={!!diseaseLabel}
                open={openFilter === "disease"}
                onToggle={() => toggleFilter("disease")}
              >
                <div className="space-y-2">
                  <select
                    value={diseaseLabel}
                    onChange={(e) => setDiseaseLabel(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">全部</option>
                    {options.diseaseLabels.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => clearColumn("disease")}
                    className="text-xs text-gold"
                  >
                    清除
                  </button>
                </div>
              </ColumnFilterButton>

              <ColumnFilterButton
                label="援助方案"
                active={!!benefit}
                open={openFilter === "benefit"}
                onToggle={() => toggleFilter("benefit")}
              >
                <div className="space-y-2">
                  <select
                    value={benefit}
                    onChange={(e) => setBenefit(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">全部</option>
                    {options.benefits.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => clearColumn("benefit")}
                    className="text-xs text-gold"
                  >
                    清除
                  </button>
                </div>
              </ColumnFilterButton>

              <ColumnFilterButton
                label="更新日期"
                active={!!crawledAfter}
                open={openFilter === "crawledAt"}
                onToggle={() => toggleFilter("crawledAt")}
              >
                <div className="space-y-2">
                  <label className="block text-[10px] text-cream-dim">更新于之后</label>
                  <input
                    type="date"
                    value={crawledAfter}
                    onChange={(e) => setCrawledAfter(e.target.value)}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => clearColumn("crawledAt")}
                    className="text-xs text-gold"
                  >
                    清除
                  </button>
                </div>
              </ColumnFilterButton>

              <ColumnFilterButton
                label="状态"
                active={!!status}
                open={openFilter === "status"}
                onToggle={() => toggleFilter("status")}
              >
                <div className="space-y-2">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">全部</option>
                    <option value="active">进行中</option>
                    <option value="closed">已结束</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => clearColumn("status")}
                    className="text-xs text-gold"
                  >
                    清除
                  </button>
                </div>
              </ColumnFilterButton>

              <th className="border-b border-cream-faint px-3 py-3 font-normal text-cream-dim">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-cream-dim">
                  没有符合条件的项目，请点击列标题调整筛选
                </td>
              </tr>
            ) : (
              filtered.map((program, index) => (
                <tr
                  key={program.id}
                  className={`transition hover:bg-navy-light ${
                    index % 2 === 0 ? "bg-navy-mid/40" : "bg-navy/40"
                  }`}
                >
                  <td className="border-b border-r border-cream-faint px-3 py-3 text-cream-dim">
                    {program.company}
                  </td>
                  <td className="border-b border-r border-cream-faint px-3 py-3 text-cream">
                    {program.drugName}
                  </td>
                  <td className="border-b border-r border-cream-faint px-3 py-3 text-cream-dim">
                    {program.diseaseLabel}
                  </td>
                  <td className="border-b border-r border-cream-faint px-3 py-3 text-gold">
                    {program.benefit}
                  </td>
                  <td className="border-b border-r border-cream-faint px-3 py-3 text-cream-dim">
                    {formatDate(program.crawledAt)}
                  </td>
                  <td className="border-b border-r border-cream-faint px-3 py-3">
                    <span
                      className={`inline-block border px-2 py-0.5 text-[11px] ${
                        program.status === "active"
                          ? "border-teal/40 bg-teal-dim text-teal"
                          : "border-cream-faint text-cream-dim"
                      }`}
                    >
                      {STATUS_LABEL[program.status]}
                    </span>
                  </td>
                  <td className="border-b border-cream-faint px-3 py-3">
                    <Link
                      href={`/d/${diseaseSlug}/charity/${program.id}`}
                      className="text-gold transition hover:text-gold-light"
                    >
                      详情
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
