# Guía de redacción por sección

Cada sección tiene **una función comercial** y **una promesa propia**. No repitas la misma promesa en dos secciones. La voz (tono elegido) es constante; cambia el registro según la función. Límites orientativos; si el agente principal o el componente define otros, prevalecen.

| # | Sección | Función comercial | Contenido obligatorio | Límite orientativo |
| :-- | :-- | :-- | :-- | :-- |
| 1 | Hero | Declarar la propuesta de valor y abrir la conversación | H1 con beneficio + subtítulo con 1–2 hechos reales + CTA principal | H1 ≤ 8 palabras · sub ≤ 22 palabras |
| 2 | Titulares y subtítulos | Guiar el escaneo | Un beneficio o hecho por titular; sin repetir el H1 | ≤ 9 palabras |
| 3 | Presentación | Responder "¿qué es este lugar?" | Qué ofrece, para quién, dónde | 40–70 palabras |
| 4 | Listado de habitaciones | Comparar y elegir | Nombre, rasgo diferencial, tarifa "desde", CTA por tarjeta | 1 línea por rasgo |
| 5 | Habitación individual | Decidir y reservar | Tipo, capacidad (si confirmada), equipamiento real, tarifa, duración, condiciones, CTA | 35–70 palabras + viñetas |
| 6 | Tarifas y promociones | Eliminar la duda de precio | Tarifa, duración, qué incluye, vigencia/condiciones; promoción solo si es real | tabla o viñetas |
| 7 | Servicios e instalaciones | Dar razones concretas | Lista de lo que existe, con beneficio de una frase | ≤ 12 palabras c/u |
| 8 | Jacuzzi, piscina, ambientación, iluminación | Hacer deseable lo diferencial | Solo instalaciones existentes; ubicación, capacidad real | 2 frases |
| 9 | Galería | Probar con imágenes | Intro de 1 línea + `alt` descriptivo y específico (qué se ve) | `alt` ≤ 120 caracteres |
| 10 | Beneficios diferenciales | Justificar elegirte | 3–4 beneficios distintos entre sí y verificables | título + 1 frase |
| 11 | Privacidad y confianza | Reducir miedo | Prácticas reales (acceso, pagos, atención); sin garantías absolutas | 3–5 viñetas |
| 12 | Preguntas frecuentes | Resolver objeciones | Respuestas con dato real; si no hay dato: "Consúltanos por WhatsApp" | respuesta ≤ 40 palabras |
| 13 | Ubicación, mapa, cómo llegar | Facilitar la visita | Dirección verificada, referencia, CTA al mapa | dirección + 1–2 frases |
| 14 | Horarios y condiciones | Fijar expectativas | Horarios, duración, edad mínima, pagos, políticas reales | viñetas |
| 15 | Botón flotante de WhatsApp | Acceso permanente | Etiqueta corta + `aria-label` | ≤ 4 palabras |
| 16 | CTA de reserva / disponibilidad | Cerrar acción | Verbo + objeto + canal | ≤ 5 palabras |
| 17 | Invitación a visitar | Llevar a lo presencial | Qué verán + cómo llegar | 1–2 frases |
| 18 | Confirmaciones y microcopy de formularios | Reducir fricción | Etiqueta, ayuda, error accionable, éxito con próximo paso | ≤ 15 palabras |
| 19 | Footer y contacto | Cerrar con datos y confianza | Dirección, contacto, horarios, aviso +18, redes | datos de `siteConfig` |
| 20 | Móvil | Decidir en una mano | CTA principal visible sin scroll; frases cortas; teléfono/WhatsApp tocables | H1 ≤ 6 líneas en 390 px |

## Reglas por sección

**Hero.** El H1 comunica el beneficio central del tono (no el nombre del motel). Subtítulo con un hecho real (jacuzzi, ubicación, acceso). Un solo CTA principal; opcionalmente uno secundario ("Ver habitaciones"). Nada de "Bienvenido a…".

**Habitaciones.** Orden de atributos: tipo/nombre → rasgo diferencial → equipamiento → capacidad (si confirmada) → tarifa y duración → condiciones. Un CTA por tarjeta, con el nombre de la habitación en el mensaje de WhatsApp. Si falta la tarifa, escribe `[tarifa pendiente]` o "Consulta la tarifa por WhatsApp".

**Tarifas y promociones.** Nunca descuentos ficticios, tachados falsos, contadores ni "últimas unidades" sin dato. Una promoción necesita vigencia o condición. Sin promoción confirmada, omite la sección.

**Privacidad.** Redacta prácticas, no garantías: "Ingreso independiente a cada habitación" (si existe) y no "100% anónimo". Evita connotaciones de ocultamiento o infidelidad.

**FAQ.** Mínimo útil: horarios y duración, pagos, edad mínima, ingreso/parqueadero, qué incluye la tarifa, cómo reservar. Cada respuesta termina, cuando aplica, en un CTA de apoyo distinto del de la sección anterior.

**Galería.** `alt` describe lo visible ("Suite con jacuzzi y luz cálida"), no la marca. Prohibido imágenes/alt con personas identificables o contenido explícito.

**Ubicación.** Solo dirección y enlace de mapas verificados (`siteConfig`). Sin "a 5 minutos de…" si no está confirmado.

**Microcopy de formulario.** Errores: qué pasó + cómo corregirlo ("Escribe un número con código de país, por ejemplo +57…"). Éxito: confirma y dice el siguiente paso real ("Recibimos tu consulta. Te respondemos por WhatsApp"); no prometer tiempos de respuesta no confirmados.

**Móvil.** Frase corta primero, detalle después. El CTA de WhatsApp ocupa el ancho disponible y no se oculta tras el scroll.

## Dónde vive el texto (monorepo `monorepo-webs`)

Si trabajas dentro de este repositorio, respeta [AGENTS.md §6](../../../../AGENTS.md):
- Los textos visibles (titulares, descripciones, FAQ, `alt`, `aria-label`, microcopy) van en `sites/<slug>/src/data/content.ts` (incluidas las etiquetas de interfaz en `UI_LABELS`).
- Teléfono, WhatsApp, dirección, mapas y horarios van en `sites/<slug>/src/config/site.ts`.
- Nunca hardcodees marca, textos ni contactos en componentes. Genera los enlaces con `buildWhatsAppUrl` de `@repo/utils`.
- Para clientes nuevos usa `pnpm new-client-site` y valida con `pnpm customize:check <slug> --strict`.
