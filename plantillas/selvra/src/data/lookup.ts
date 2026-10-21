import { EXPERIENCES, type Experience, STAYS, type Stay } from "@/data/content";

/** Busca una estancia por slug; falla en el build si `content.ts` apunta a un slug inexistente. */
export function getStay(slug: string): Stay {
  const stay = STAYS.find((item) => item.slug === slug);
  if (!stay) throw new Error(`content.ts: no existe la estancia "${slug}".`);
  return stay;
}

/** Busca una experiencia por slug; falla en el build si `content.ts` apunta a un slug inexistente. */
export function getExperience(slug: string): Experience {
  const experience = EXPERIENCES.find((item) => item.slug === slug);
  if (!experience) throw new Error(`content.ts: no existe la experiencia "${slug}".`);
  return experience;
}
