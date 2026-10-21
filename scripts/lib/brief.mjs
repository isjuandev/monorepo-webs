import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { canonicalSlug, listTemplates, RECURSOS_DIR, ROOT_DIR, resolveSite } from "./paths.mjs";

export { RECURSOS_DIR, ROOT_DIR } from "./paths.mjs";
export const KEBAB_CASE_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalize(text) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export function stripHtmlComments(text) {
  return text.replace(/<!--[\s\S]*?-->/g, "");
}

/** Divide el brief en secciones "## " con sus líneas */
export function parseSections(text) {
  const sections = {};
  let section = null;
  for (const line of text.split("\n")) {
    if (line.startsWith("## ")) {
      section = { lines: [] };
      sections[normalize(line.slice(3))] = section;
    } else if (section) {
      section.lines.push(line);
    }
  }
  return sections;
}

/** Valor de un campo "- Etiqueta: valor" de una sección (busca por prefijo, sin acentos) */
export function field(section, label) {
  const target = normalize(label);
  for (const line of section?.lines ?? []) {
    const match = /^- ([^:]+):\s*(.*)$/.exec(line);
    if (match && normalize(match[1]).startsWith(target)) {
      return match[2].trim();
    }
  }
  return "";
}

/** Quita aclaraciones entre paréntesis para validar el valor */
export function cleanValue(value) {
  return value.split(" (")[0].trim();
}

export function slugify(text) {
  return normalize(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Un valor opcional del brief es utilizable si no está vacío ni marcado como pendiente */
function optional(value) {
  const clean = cleanValue(value);
  return clean && !/pendiente/i.test(clean) ? clean : "";
}

/**
 * Lee y valida recursos/<slug>/brief.md.
 * Devuelve los datos de generación y la lista de errores (vacía si el brief es utilizable).
 */
export function parseBrief(slug) {
  const errors = [];
  const briefPath = path.join(RECURSOS_DIR, slug, "brief.md");
  if (!fs.existsSync(briefPath)) {
    return { errors: [`no existe ${path.relative(ROOT_DIR, briefPath)}.`] };
  }

  const sections = parseSections(stripHtmlComments(fs.readFileSync(briefPath, "utf8")));
  const generation = sections[normalize("Generación")];
  const required = {
    "Plantilla base": field(generation, "Plantilla base"),
    Slug: field(generation, "Slug"),
    "Nombre comercial": field(generation, "Nombre comercial"),
    Dominio: field(generation, "Dominio"),
    Locale: field(generation, "Locale"),
    "Tipo de negocio": field(generation, "Tipo de negocio"),
  };
  const missing = Object.entries(required)
    .filter(([, value]) => !cleanValue(value) || /pendiente|\|/i.test(cleanValue(value)))
    .map(([label]) => label);
  if (missing.length > 0) {
    errors.push(`el brief no tiene completos estos campos obligatorios: ${missing.join(", ")}.`);
  }
  if (required.Slug && required.Slug.trim() !== slug) {
    errors.push(
      `el slug del brief ("${required.Slug.trim()}") no coincide con la carpeta recursos/${slug}/.`
    );
  }
  const plantilla = canonicalSlug(cleanValue(required["Plantilla base"]));
  if (plantilla && !listTemplates().includes(plantilla)) {
    errors.push(
      `la plantilla "${plantilla}" no existe en plantillas/ (disponibles: ${listTemplates().join(", ")}).`
    );
  }

  const motel = /motel/i.test(required["Tipo de negocio"]);
  const rooms = (sections[normalize("Habitaciones")]?.lines ?? [])
    .filter((line) => line.startsWith("### ") && !line.includes("<"))
    .map((line) => slugify(line.slice(4)));
  const routes = [
    "/",
    ...(rooms.length > 0 ? ["/habitaciones"] : []),
    ...rooms.map((room) => `/habitaciones/${room}`),
  ].join(",");
  const contact = sections[normalize("Contacto")];

  return {
    errors,
    briefPath,
    plantilla,
    name: cleanValue(required["Nombre comercial"]),
    domain: cleanValue(required.Dominio),
    locale: /\(([a-z]{2}_[A-Z]{2})\)/.exec(required.Locale)?.[1] ?? cleanValue(required.Locale),
    motel,
    branch: `cliente/${slug}`,
    rooms,
    routes,
    contact: {
      phone: optional(field(contact, "Teléfono")),
      whatsapp: optional(field(contact, "WhatsApp")),
      email: optional(field(contact, "Correo")),
      address: optional(field(contact, "Dirección")),
    },
  };
}

// Campos del brief que identifican a un cliente: no pueden quedar con el valor de la plantilla
const IDENTITY_FIELDS = [
  ["Generación", "Nombre comercial"],
  ["Generación", "Dominio"],
  ["Contacto", "Teléfono"],
  ["Contacto", "WhatsApp"],
  ["Contacto", "Correo"],
  ["Contacto", "Dirección"],
  ["Contacto", "Enlace de mapa"],
  ["Contacto", "Redes sociales"],
];

function briefFields(briefPath) {
  const sections = parseSections(stripHtmlComments(fs.readFileSync(briefPath, "utf8")));
  return Object.fromEntries(
    IDENTITY_FIELDS.map(([section, label]) => [label, field(sections[normalize(section)], label)])
  );
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(full);
    return entry.name.startsWith(".") ? [] : [full];
  });
}

const hashFile = (file) => crypto.createHash("sha1").update(fs.readFileSync(file)).digest("hex");

// Recursos versionados que sirven de ejemplo: un cliente nuevo no debe conservar sus datos ni archivos
const EXAMPLE_RECURSOS = ["_plantilla-cliente", "la-guaca"];

/**
 * Restos de ejemplo en recursos/<slug>/: datos de identidad y contacto iguales a los de los
 * recursos de ejemplo (recursos/_plantilla-cliente/ y recursos/la-guaca/) y archivos idénticos a
 * los de esos ejemplos o a las imágenes de la plantilla base (plantillas/<plantilla>/public/).
 */
export function recursosLeftovers(slug, plantilla) {
  const clientBrief = path.join(RECURSOS_DIR, slug, "brief.md");
  if (!fs.existsSync(clientBrief)) {
    return { fields: [], files: [] };
  }
  const examples = EXAMPLE_RECURSOS.filter((name) => name !== slug).map((name) =>
    path.join(RECURSOS_DIR, name)
  );

  const client = briefFields(clientBrief);
  const fields = new Set();
  for (const example of examples) {
    const exampleBrief = path.join(example, "brief.md");
    if (!fs.existsSync(exampleBrief)) continue;
    const template = briefFields(exampleBrief);
    for (const label of Object.keys(template)) {
      const value = cleanValue(template[label]);
      if (value && !/^pendiente$/i.test(value) && cleanValue(client[label]) === value) {
        fields.add(label);
      }
    }
  }

  const site = plantilla ? resolveSite(plantilla) : null;
  const templateHashes = new Set(
    [...examples, ...(site ? [path.join(site.dir, "public")] : [])]
      .flatMap((dir) => listFiles(dir))
      .filter((file) => path.basename(file) !== "brief.md")
      .map(hashFile)
  );
  const files = listFiles(path.join(RECURSOS_DIR, slug))
    .filter((file) => !file.includes(`${path.sep}entrada${path.sep}`))
    .filter((file) => !file.includes(`${path.sep}.intake${path.sep}`))
    .filter((file) => path.basename(file) !== "brief.md" && templateHashes.has(hashFile(file)))
    .map((file) => path.relative(ROOT_DIR, file));

  return { fields: [...fields], files };
}
