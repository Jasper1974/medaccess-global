export function filterByDisease<T extends { diseaseSlugs: string[] }>(
  items: T[],
  diseaseSlug: string,
): T[] {
  return items.filter(
    (item) =>
      item.diseaseSlugs.includes(diseaseSlug) ||
      item.diseaseSlugs.includes("other-unspecified"),
  );
}

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export function parseSourceDate(value: string): Date {
  return parseDate(value);
}
