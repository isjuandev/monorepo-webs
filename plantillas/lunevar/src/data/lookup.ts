import { ARTICLES, type Article, PROGRAMS, type Program, SUITES, type Suite } from "@/data/content";

/** Busca una suite por slug; falla en el build si `content.ts` apunta a un slug inexistente. */
export function getSuite(slug: string): Suite {
  const suite = SUITES.find((item) => item.slug === slug);
  if (!suite) throw new Error(`content.ts: no existe la suite "${slug}".`);
  return suite;
}

/** Busca un programa por slug; falla en el build si no existe. */
export function getProgram(slug: string): Program {
  const program = PROGRAMS.find((item) => item.slug === slug);
  if (!program) throw new Error(`content.ts: no existe el programa "${slug}".`);
  return program;
}

/** Busca una carta del diario por slug; falla en el build si no existe. */
export function getArticle(slug: string): Article {
  const article = ARTICLES.find((item) => item.slug === slug);
  if (!article) throw new Error(`content.ts: no existe la carta "${slug}".`);
  return article;
}
