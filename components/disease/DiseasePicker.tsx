"use client";

import Link from "next/link";
import { useState } from "react";
import { DISEASE_CATEGORIES } from "@/lib/diseases/catalog";

export function DiseasePicker() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <section id="diseases" className="px-6 py-20 md:px-14">
      <div className="mx-auto max-w-5xl">
        <div className="text-xs tracking-[0.25em] text-gold">// 选择病种</div>
        <h2 className="mt-3 font-serif text-3xl leading-tight text-cream md:text-4xl">
          您在为哪种疾病寻找用药方案？
        </h2>
        <p className="mt-4 max-w-2xl text-cream-dim">
          选择后进入该病种专属导航页，浏览临床试验、慈善赠药与四大合规通道信息。
          需要专属方案时，再上传资料。
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {DISEASE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() =>
                setActiveCategory(
                  activeCategory === category.id ? null : category.id,
                )
              }
              className={`border px-4 py-2 text-sm tracking-wide transition ${
                activeCategory === category.id
                  ? "border-gold bg-gold-dim text-gold"
                  : "border-cream-faint text-cream-dim hover:border-gold hover:text-gold"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {activeCategory ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DISEASE_CATEGORIES.find((c) => c.id === activeCategory)?.children.map(
              (disease) => (
                <Link
                  key={disease.id}
                  href={`/d/${disease.slug}`}
                  className="group border border-cream-faint bg-navy-mid p-5 transition hover:border-gold hover:bg-navy-light"
                >
                  <div className="text-xs tracking-widest text-gold opacity-70">
                    {disease.parentName}
                  </div>
                  <div className="mt-2 text-cream transition group-hover:text-gold">
                    {disease.name}
                  </div>
                  <div className="mt-3 text-xs text-cream-dim">
                    进入专属导航 →
                  </div>
                </Link>
              ),
            )}
          </div>
        ) : (
          <p className="mt-6 text-sm text-cream-dim">
            请先点击上方大类，再选择具体分型。
          </p>
        )}
      </div>
    </section>
  );
}
