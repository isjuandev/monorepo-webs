---
name: motel-copywriting
description: Define la voz de marca, el tono y las reglas de redacción comercial de sitios web de moteles (para adultos): selecciona entre 50 tonos documentados en 10 estilos, redacta todas las secciones de la web y gobierna los CTA hacia reserva por WhatsApp y visita presencial, sin inventar datos. Úsala al escribir o revisar textos de cualquier sitio de motel/hotel por horas en sites/<slug-cliente>.
---

# Motel Copywriting (`motel-copywriting`)

Sistema de comunicación para sitios web de moteles. Gobierna **toda la página** (hero, habitaciones, tarifas, servicios, galería, FAQ, ubicación, microcopy, footer), no solo titulares. Prioridad: convertir visitantes en clientes reales (reserva/consulta por WhatsApp y visita presencial) sin sacrificar identidad de marca ni claridad.

## 1. Objetivo y alcance

- **Hace:** elegir tono, fijar una guía de voz, redactar todas las secciones, generar CTA y enlaces de WhatsApp, verificar calidad.
- **No hace:** inventar servicios, precios, horarios, promociones, ubicación, políticas, números de teléfono ni disponibilidad; ni escribir contenido sexual explícito; ni dirigirse a menores.
- **Público:** siempre adultos (18+).
- **Idioma por defecto:** español neutro; ajusta léxico al país si el usuario lo indica (usa `locale` de `siteConfig` cuando exista).
- **Dentro de este monorepo:** el texto vive en `sites/<slug>/src/data/content.ts` y los contactos en `src/config/site.ts` (ver [AGENTS.md §6](../../../AGENTS.md)). No hardcodees marca, textos ni contactos en componentes. Los enlaces se generan con `buildWhatsAppUrl` de `@repo/utils`.

## 1.1. Fuente de datos: `recursos/<slug-cliente>/` (modo monorepo)

Dentro de este monorepo la skill **no depende de datos pegados en el prompt**: la fuente única es la carpeta `recursos/<slug-cliente>/` (ver [recursos/README.md](../../../recursos/README.md)), y el único dato que recibe es el slug.

| Dato | Dónde lo lee |
| :-- | :-- |
| Estilo (1-10), tono principal, tono secundario, persona gramatical, público objetivo | Sección "Tono" de `brief.md` |
| Nombre, contacto, WhatsApp, dirección, horarios, pagos, políticas | `brief.md` (secciones Contacto y Horarios) |
| Habitaciones, tarifas, duración, capacidad, equipamiento | Tabla "Habitaciones / servicios" de `brief.md` |
| FAQ, promociones, notas | `brief.md` y archivos de `textos/` |
| Textos previos del cliente | `textos/` (úsalos como base, respeta los datos reales) |
| Identidad visual y fotos (para `alt` y coherencia) | `marca/` y `fotos/` |
| Inspiración | `referencias/` (solo referencia, nunca copiar textos ajenos) |

Reglas del modo monorepo:
- **Solo lectura:** no modifiques ni borres nada en `recursos/`.
- **Campo vacío = pendiente:** aplica la tabla del §9 (marcadores `[..._PENDIENTE]`); no inventes.
- **Si el estilo o el tono no están en `brief.md`**, aplica el flujo de §5 (tono conservador) y declara el supuesto; no preguntes salvo conflicto entre fuentes o falta total de servicios.
- **Si el tono principal y el secundario son incompatibles** (ver combinaciones seguras en §5), avisa y propón la alternativa más cercana antes de redactar.
- **Guía de voz (paso 3):** guárdala en `docs/research/<slug-cliente>/guia-de-voz.md` (no en `recursos/`).
- **Si falta `recursos/<slug-cliente>/brief.md`**, detente y avisa. Si el usuario da datos por chat, tienen prioridad sobre el brief, pero señala la contradicción.

## 2. Archivos de la skill (cuándo consultar cada uno)

| Archivo | Consúltalo cuando… |
| :-- | :-- |
| Este `SKILL.md` | Siempre. Contiene flujo, selección de tono, reglas globales y plantilla de guía de voz |
| [references/estilo-01-romantico.md](./references/estilo-01-romantico.md) … [estilo-10-suites-especiales.md](./references/estilo-10-suites-especiales.md) | Ya elegiste estilo: **lee solo el archivo de ese estilo** (y el del tono secundario si lo hay) |
| [references/secciones.md](./references/secciones.md) | Vas a redactar cada sección de la web |
| [references/cta-whatsapp.md](./references/cta-whatsapp.md) | Vas a escribir CTA, enlaces `wa.me` o invitaciones a visitar |
| [references/verificacion.md](./references/verificacion.md) | Vas a verificar y entregar (lista, criterios, frases prohibidas) |

No cargues los 10 archivos de estilo: solo el necesario.

## 3. Catálogo de estilos y tonos

Cada estilo tiene 5 tonos con identificador (`R1`…`K5`). Detalle completo en su archivo.

| # | Estilo | Archivo | Tonos |
| :-- | :-- | :-- | :-- |
| 1 | Romántico | `estilo-01-romantico.md` | R1 Aniversario cálido · R2 Escapada de enamorados · R3 Sorpresa y primeras veces · R4 Poético íntimo · R5 Complicidad serena |
| 2 | Sensual y de pasión | `estilo-02-sensual.md` | S1 Seducción elegante · S2 Complicidad privada · S3 Fuego lento · S4 Atrevido con clase · S5 Pasión sofisticada |
| 3 | Premium / lujo | `estilo-03-premium.md` | P1 Lujo silencioso · P2 Diseño de autor · P3 Servicio de mayordomo · P4 Exclusividad aspiracional · P5 Celebración de gala |
| 4 | Económico | `estilo-04-economico.md` | E1 Precio claro · E2 Práctico y directo · E3 Cercano de barrio · E4 Valor inteligente · E5 Promo honesta |
| 5 | Moderno y urbano | `estilo-05-moderno-urbano.md` | U1 Smart y eficiente · U2 Minimal de ciudad · U3 Noche de ciudad · U4 Experto en comodidad · U5 Conectado y rápido |
| 6 | Temático | `estilo-06-tematico.md` | T1 Narrador de mundos · T2 Cinematográfico · T3 Viajero imaginario · T4 Fantasía adulta · T5 Coleccionista de detalles |
| 7 | Discreto y privado | `estilo-07-discreto.md` | D1 Reserva y respeto · D2 Acceso fácil · D3 Calma y silencio · D4 Pago y trámite simples · D5 Confianza cercana |
| 8 | Escapada / descanso | `estilo-08-escapada.md` | X1 Desconexión total · X2 Spa urbano · X3 Plan de fin de semana · X4 Descanso reparador · X5 Cambio de aire |
| 9 | Juvenil y dinámico (adultos) | `estilo-09-juvenil.md` | J1 Espontáneo · J2 Fresco y colorido · J3 Social y compartible · J4 Atrevido y divertido · J5 Energía de pareja |
| 10 | Jacuzzi / suites / experiencias | `estilo-10-suites-especiales.md` | K1 Protagonista: el jacuzzi · K2 Suite-experiencia · K3 Piscina y terraza · K4 Ambiente de show · K5 Servicio y detalle de bienvenida |

### 4. Estructura de cada tono (formato obligatorio al documentar o ampliar)

Nombre · Personalidad · Objetivo comercial · Público objetivo · Emoción principal · Nivel de formalidad · Intensidad comercial (sutil/moderada/directa) · Vocabulario recomendado · Vocabulario prohibido o desaconsejado · Estilo de titulares · Estilo de descripciones · Estilo de CTA · Ejemplo de hero (titular, subtítulo, CTA) · Ejemplo de habitación · Ejemplo de WhatsApp · Ejemplo de visita · Antiejemplo con explicación.

Los ejemplos de los archivos usan `[…]` para datos que **deben salir del negocio**. Nunca publiques un `[…]` sin resolver: sustitúyelo por el dato real o por un marcador `[…_PENDIENTE]` reportado al usuario.

## 5. Selección de marca y tono (flujo de decisión)

Usa las fuentes en este orden de prioridad:

1. **Estilo de motel indicado expresamente** por el usuario o en la sección "Tono" de `recursos/<slug-cliente>/brief.md`.
2. **Información comercial e identidad de marca** proporcionadas (nombre, eslogan, paleta, textos previos, referencias).
3. **Servicios, instalaciones, precios y experiencia reales** (qué existe de verdad).
4. **Público objetivo declarado.**
5. **Tono pedido explícitamente por el usuario** (si es compatible con lo anterior; si choca con 1–3, señálalo y propone la alternativa más cercana).

Reglas:
- Elige **un tono principal**. Opcionalmente **un tono secundario** (máx. 1) que lo complemente, usado solo en secciones concretas (p. ej. principal "Lujo silencioso" + secundario "Servicio de mayordomo" en servicios y FAQ). El principal domina en hero, titulares y CTA.
- **No mezcles tonos incompatibles** (p. ej. Premium con Promo honesta; Poético íntimo con Espontáneo) salvo petición expresa de la estrategia de marca. Combinaciones seguras: R1+R5, R4+S5, P1+P3, E1+E4, U1+U5, T1+T5, D1+D2, X1+X2, K1+K2.
- **Datos insuficientes:** usa el tono conservador del estilo más neutro: `R5 Complicidad serena` (romántico/general), `E1 Precio claro` (económico) o `D1 Reserva y respeto` (discreto); sin inventar atributos. Declara el supuesto en la entrega.
- **Pregunta al usuario solo si la falta de datos impide un resultado fiable:** estilo imposible de inferir, ausencia total de servicios/tarifas o conflicto entre fuentes. Haz una única pregunta agrupada, con opciones y un valor por defecto.
- **Una vez elegido el tono, mantenlo** en todas las páginas y componentes.

## 6. Flujo de trabajo (7 pasos)

1. **Analizar.** Lee `recursos/<slug-cliente>/` (§1.1) y extrae: estilo de motel, nombre, ciudad/zona, habitaciones (nombres, tarifas, duración, capacidad, equipamiento), instalaciones, servicios, horarios, formas de pago, políticas, WhatsApp, dirección/mapa, público objetivo, restricciones legales/de plataforma. Marca lo ausente como `_PENDIENTE`.
2. **Seleccionar.** Aplica el flujo de §5; registra tono principal (y secundario).
3. **Establecer.** Crea la **guía de voz** (plantilla en §7) y úsala como referencia en cada sección.
4. **Redactar.** Escribe cada sección según [secciones.md](./references/secciones.md), con atributos reales y un único mensaje por sección (sin repetir promesas).
5. **Convertir.** Incorpora CTA según la jerarquía de [cta-whatsapp.md](./references/cta-whatsapp.md): WhatsApp, exploración y visita.
6. **Verificar.** Pasa la lista de [verificacion.md](./references/verificacion.md); corrige hasta cumplir los criterios de aceptación.
7. **Entregar.** Devuelve el contenido en el formato y límites que defina el agente principal (p. ej. `content.ts`, objetos por página, JSON). Añade un resumen ≤ 5 líneas: tono elegido, datos pendientes y supuestos.

## 7. Plantilla de guía de voz (entregable interno del paso 3)

```text
Motel: <nombre> · Estilo: <estilo> · Tono principal: <ID nombre> · Secundario: <ID o ninguno>
Persona gramatical: <tú | usted | ustedes> (única en todo el sitio)
Promesa central (1 frase verificable): …
3 palabras ancla: … · 3 palabras prohibidas: …
Ritmo: <frases de N palabras en promedio>, <uso de signos de exclamación: nunca/raro>
CTA principal: <texto> · CTA secundario: <texto> · CTA de apoyo: <texto>
WhatsApp: <enlace o WHATSAPP_PENDIENTE> · Mensaje inicial: <texto>
Datos pendientes: …
```

## 8. Reglas globales de copywriting

1. **Especificidad antes que adjetivo.** Cada afirmación lleva un atributo verificable (qué, cuánto, dónde).
2. **Una frase si cabe en una frase.** Sin párrafos largos para beneficios simples.
3. **Una promesa por sección.** No repitas el mismo beneficio en varias partes.
4. **Sin clichés ni superlativos** sin evidencia ("el mejor", "único", "perfecto"). "Experiencia", "exclusivo", "inolvidable" y "único": máximo 1 vez cada una por página y acompañadas de un beneficio concreto.
5. **Sensualidad sugerida, nunca explícita.** El estilo sensual no usa lenguaje sexual explícito.
6. **Privacidad = prácticas concretas**, nunca garantía absoluta ni anonimato total.
7. **Sin urgencia artificial, escasez inventada ni descuentos ficticios.**
8. **Sin disponibilidad prometida.** Se "consulta", no se "garantiza".
9. **Adultos:** sin lenguaje infantil, diminutivos de tono juvenil ni referencias a menores.
10. **Una voz por sitio.** Cada estilo/tono mantiene su vocabulario; no homogeneices todo en la misma voz comercial.
11. **Accesibilidad textual:** `alt` descriptivos, `aria-label` con acción, enlaces con texto claro.
12. **Móvil primero:** títulos cortos, CTA visible sin scroll, frases de lectura rápida.

## 9. Manejo de información desconocida

| Falta… | Haz… |
| :-- | :-- |
| Tarifa | Omite la cifra o escribe "Consulta la tarifa por WhatsApp" / `[TARIFA_PENDIENTE]` |
| Capacidad, tamaño, equipamiento | Omite el atributo; no lo deduzcas de las fotos si no es evidente |
| Horarios, duración de estancia | `[HORARIO_PENDIENTE]`; no escribas "24 horas" sin confirmación |
| Promoción | No crees ninguna; omite la sección |
| WhatsApp | `[WHATSAPP_PENDIENTE]`; ver [cta-whatsapp.md](./references/cta-whatsapp.md) §4 |
| Dirección / mapa | `[DIRECCION_PENDIENTE]` / `[MAPA_PENDIENTE]`; sin "a X minutos de…" |
| Políticas (edad, pagos, ingreso) | No las inventes; FAQ: "Consúltanos por WhatsApp" |
| Tono o estilo no claros | Tono conservador del §5 + declarar supuesto |

Reporta siempre la lista de pendientes en la entrega. En el repositorio, un marcador pendiente en un sitio de cliente real debe resolverse antes de `pnpm customize:check <slug> --strict`.

## 10. Ejemplos positivos y negativos (resumen)

Cada tono incluye su antiejemplo propio. Pares transversales y frases prohibidas: [verificacion.md](./references/verificacion.md).

- ✅ "Suite Jacuzzi: cama king, jacuzzi para dos y luz regulable. $[tarifa] por [duración]. Reserva por WhatsApp." → específico, con tarifa, duración y CTA.
- ❌ "Vive una experiencia única e inolvidable en nuestra increíble suite." → cliché, sin dato, sin CTA.

## 11. Criterios de aceptación y entrega

Ver lista de verificación y criterios medibles en [verificacion.md](./references/verificacion.md). El trabajo solo está terminado cuando: (a) todos los criterios cumplen o están marcados como pendientes por falta de datos, (b) el tono es consistente de punta a punta, (c) todos los CTA llevan a una acción real o a un marcador reportado, y (d) la entrega incluye el resumen del paso 7.
