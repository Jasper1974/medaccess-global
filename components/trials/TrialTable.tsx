"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ClinicalTrialRecord } from "@/types/trial";
import { getTrialFilterOptions } from "@/lib/trials";
import { getTrialDisplayTitle, getTrialSearchText } from "@/lib/trials/display";

interface TrialTableProps {
  trials: ClinicalTrialRecord[];
  diseaseSlug: string;
}

type FilterKey =
  | "sourceId"
  | "title"
  | "disease"
  | "phase"
  | "location"
  | "recruitEnd"
  | "crawledAt"
  | "status";

const STATUS_LABEL: Record<ClinicalTrialRecord["status"], string> = {
  recruiting: "招募中",
  suspended: "已暂停",
  completed: "已结束",
};

function formatDate(value: string | null): string {
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

export function TrialTable({ trials, diseaseSlug }: TrialTableProps) {
  const options = useMemo(() => getTrialFilterOptions(trials), [trials]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [phase, setPhase] = useState("");
  const [diseaseLabel, setDiseaseLabel] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");
  const [recruitEndBefore, setRecruitEndBefore] = useState("");
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
    return trials.filter((trial) => {
      if (keyword) {
        const q = keyword.toLowerCase();
        const haystack = getTrialSearchText(trial).toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (source && trial.source !== source) return false;
      if (location && !trial.locations.includes(location)) return false;
      if (phase && trial.phase !== phase) return false;
      if (diseaseLabel && trial.diseaseLabel !== diseaseLabel) return false;
      if (status && trial.status !== status) return false;
      if (
        recruitEndBefore &&
        trial.recruitmentEndDate &&
        trial.recruitmentEndDate > recruitEndBefore
      ) {
        return false;
      }
      if (crawledAfter && trial.crawledAt < crawledAfter) return false;
      return true;
    });
  }, [
    trials,
    keyword,
    location,
    phase,
    diseaseLabel,
    source,
    status,
    recruitEndBefore,
    crawledAfter,
  ]);

  function toggleFilter(key: FilterKey) {
    setOpenFilter((prev) => (prev === key ? null : key));
  }

  function clearColumn(key: FilterKey) {
    switch (key) {
      case "sourceId":
        setSource("");
        break;
      case "title":
        setKeyword("");
        break;
      case "disease":
        setDiseaseLabel("");
        break;
      case "phase":
        setPhase("");
        break;
      case "location":
        setLocation("");
        break;
      case "recruitEnd":
        setRecruitEndBefore("");
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
        共 {trials.length} 条，当前显示 {filtered.length} 条 · 点击列标题筛选
      </div>

      <div className="overflow-x-auto border border-cream-faint">
        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
          <thead className="bg-navy-light text-xs tracking-wider">
            <tr>
              <ColumnFilterButton
                label="编号"
                active={!!source}
                open={openFilter === "sourceId"}
                onToggle={() => toggleFilter("sourceId")}
              >
                <div className="space-y-2">
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">全部来源</option>
                    <option value="clinicaltrials">ClinicalTrials.gov</option>
                    <option value="chictr">ChiCTR</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => clearColumn("sourceId")}
                    className="text-xs text-gold"
                  >
                    清除
                  </button>
                </div>
              </ColumnFilterButton>

              <ColumnFilterButton
                label="试验名称"
                active={!!keyword}
                open={openFilter === "title"}
                onToggle={() => toggleFilter("title")}
              >
                <div className="space-y-2">
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="搜索名称或编号"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => clearColumn("title")}
                    className="text-xs text-gold"
                  >
                    清除
                  </button>
                </div>
              </ColumnFilterButton>

              <ColumnFilterButton
                label="病种"
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
                label="分期"
                active={!!phase}
                open={openFilter === "phase"}
                onToggle={() => toggleFilter("phase")}
              >
                <div className="space-y-2">
                  <select
                    value={phase}
                    onChange={(e) => setPhase(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">全部</option>
                    {options.phases.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => clearColumn("phase")}
                    className="text-xs text-gold"
                  >
                    清除
                  </button>
                </div>
              </ColumnFilterButton>

              <ColumnFilterButton
                label="地点"
                active={!!location}
                open={openFilter === "location"}
                onToggle={() => toggleFilter("location")}
              >
                <div className="space-y-2">
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">全部</option>
                    {options.locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => clearColumn("location")}
                    className="text-xs text-gold"
                  >
                    清除
                  </button>
                </div>
              </ColumnFilterButton>

              <ColumnFilterButton
                label="招募截止"
                active={!!recruitEndBefore}
                open={openFilter === "recruitEnd"}
                onToggle={() => toggleFilter("recruitEnd")}
              >
                <div className="space-y-2">
                  <label className="block text-[10px] text-cream-dim">截止于之前</label>
                  <input
                    type="date"
                    value={recruitEndBefore}
                    onChange={(e) => setRecruitEndBefore(e.target.value)}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => clearColumn("recruitEnd")}
                    className="text-xs text-gold"
                  >
                    清除
                  </button>
                </div>
              </ColumnFilterButton>

              <ColumnFilterButton
                label="爬取日期"
                active={!!crawledAfter}
                open={openFilter === "crawledAt"}
                onToggle={() => toggleFilter("crawledAt")}
              >
                <div className="space-y-2">
                  <label className="block text-[10px] text-cream-dim">爬取于之后</label>
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
                    <option value="recruiting">招募中</option>
                    <option value="suspended">已暂停</option>
                    <option value="completed">已结束</option>
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
                <td colSpan={9} className="px-4 py-12 text-center text-cream-dim">
                  没有符合条件的试验，请点击列标题调整筛选
                </td>
              </tr>
            ) : (
              filtered.map((trial, index) => (
                <tr
                  key={trial.id}
                  className={`transition hover:bg-navy-light ${
                    index % 2 === 0 ? "bg-navy-mid/40" : "bg-navy/40"
                  }`}
                >
                  <td className="border-b border-r border-cream-faint px-3 py-3 font-mono text-xs text-cream-dim">
                    {trial.sourceId}
                  </td>
                  <td className="border-b border-r border-cream-faint px-3 py-3 text-cream">
                    <div>{getTrialDisplayTitle(trial)}</div>
                    {trial.titleCn && trial.titleCn !== trial.title ? (
                      <div className="mt-1 line-clamp-1 text-xs text-cream-dim">
                        {trial.title}
                      </div>
                    ) : null}
                  </td>
                  <td className="border-b border-r border-cream-faint px-3 py-3 text-cream-dim">
                    {trial.diseaseLabel}
                  </td>
                  <td className="border-b border-r border-cream-faint px-3 py-3 text-cream-dim">
                    {trial.phase}
                  </td>
                  <td className="border-b border-r border-cream-faint px-3 py-3 text-cream-dim">
                    {trial.locations.join("、")}
                  </td>
                  <td className="border-b border-r border-cream-faint px-3 py-3 text-cream-dim">
                    {formatDate(trial.recruitmentEndDate)}
                  </td>
                  <td className="border-b border-r border-cream-faint px-3 py-3 text-cream-dim">
                    {formatDate(trial.crawledAt)}
                  </td>
                  <td className="border-b border-r border-cream-faint px-3 py-3">
                    <span
                      className={`inline-block border px-2 py-0.5 text-[11px] ${
                        trial.status === "recruiting"
                          ? "border-teal/40 bg-teal-dim text-teal"
                          : "border-cream-faint text-cream-dim"
                      }`}
                    >
                      {STATUS_LABEL[trial.status]}
                    </span>
                  </td>
                  <td className="border-b border-cream-faint px-3 py-3">
                    <Link
                      href={`/d/${diseaseSlug}/trials/${trial.id}`}
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
