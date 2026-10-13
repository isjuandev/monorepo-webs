# Sistema de CTA, WhatsApp y visita presencial

## 1. Jerarquía predeterminada

1. **CTA principal:** reservar o consultar disponibilidad por WhatsApp.
2. **CTA secundario:** explorar habitaciones, suites o servicios.
3. **CTA de apoyo:** visitar el establecimiento, ver ubicación o cómo llegar.

El orden puede cambiar si el negocio lo justifica (p. ej. no tiene WhatsApp; entonces el principal es llamada o formulario). Máximo **un CTA principal y uno secundario visibles por bloque**. Un CTA = un verbo + un objeto concreto + (opcional) el canal.

## 2. Dónde colocar CTA (recorrido del usuario)

| Punto | CTA recomendado | Nivel |
| :-- | :-- | :-- |
| Hero | WhatsApp / disponibilidad + "Ver habitaciones" | principal + secundario |
| Tras presentación | "Ver habitaciones" | secundario |
| Cada tarjeta de habitación | "Reservar [nombre] por WhatsApp" | principal |
| Tarifas | "Solicitar información sobre tarifas" | principal |
| Servicios / instalaciones | "Consultar si [instalación] está libre hoy" | apoyo |
| Galería | "Ver habitaciones" o "Consultar por la que te gustó" | secundario |
| FAQ | CTA contextual por respuesta (WhatsApp o mapa) | apoyo |
| Ubicación | "Cómo llegar" (mapa) | apoyo |
| Cierre de página | WhatsApp + invitación a visitar | principal + apoyo |
| Botón flotante | WhatsApp (siempre visible en móvil) | principal |
| Footer | WhatsApp + dirección | apoyo |

No repitas la misma etiqueta literal más de dos veces por página: varía por contexto y tono.

## 3. Banco base de CTA (adáptalo al tono; no lo copies tal cual)

- WhatsApp / reserva: Reservar por WhatsApp · Consulta disponibilidad por WhatsApp · Escríbenos y organiza tu visita · Reserva tu suite ahora · Solicita información sobre tarifas · Consulta las opciones disponibles · Pregunta por nuestras habitaciones.
- Exploración: Ver habitaciones · Conocer las suites · Ver servicios · Ver tarifas.
- Visita: Conocer las instalaciones · Ver cómo llegar · Abrir en mapas · Planificar tu visita · Consultar condiciones de ingreso.

Reformula con el vocabulario del tono (ver el catálogo). Ejemplo: tono "Lujo silencioso" → "Solicitar reserva"; tono "Práctico y directo" → "Pregunta qué hay libre".

## 4. Enlace de WhatsApp

Formato oficial: `https://wa.me/NUMERO`

Reglas:
1. `NUMERO` en formato internacional: solo dígitos, sin `+`, espacios, guiones ni paréntesis (código de país + número).
2. Mensaje inicial opcional en `?text=` con codificación URL (`encodeURIComponent`). Debe ser breve (≤ 120 caracteres), natural, en la voz del tono y, si procede, mencionar la habitación o la fecha.
3. Un enlace por contexto: cada tarjeta de habitación puede llevar su propio mensaje.
4. Abrir con `target="_blank"` y `rel="noopener noreferrer"`; añadir `aria-label` descriptivo desde `UI_LABELS`.
5. **Nunca inventes números.** Si no hay número válido, usa un marcador identificable y avisa al agente principal / usuario:
   - Dato: `[WHATSAPP_PENDIENTE: número internacional sin + ni espacios]`
   - El CTA no debe renderizarse como enlace roto; deja el botón deshabilitado o apunta al CTA alternativo (llamada o formulario) hasta tener el dato.
6. Ejemplo ilustrativo (número ficticio): `https://wa.me/573001234567?text=Hola%2C%20quisiera%20consultar%20disponibilidad%20de%20habitaciones.`

**En este monorepo:** el número vive en `siteConfig` (`src/config/site.ts`), el mensaje por defecto en `src/data/content.ts` y el enlace se genera con `buildWhatsAppUrl(phone, message)` de `@repo/utils` (limpia el número y codifica el texto).

### Mensajes iniciales por intención (plantillas; adapta al tono)

| Intención | Plantilla |
| :-- | :-- |
| Disponibilidad hoy | "Hola, ¿qué habitaciones tienen disponibles hoy?" |
| Habitación concreta | "Hola, me interesa la habitación [nombre]. ¿Está disponible?" |
| Fecha concreta | "Hola, quisiera reservar para el [fecha] a las [hora]." |
| Tarifas | "Hola, ¿me comparten las tarifas?" |
| Ocasión | "Hola, quiero celebrar [ocasión] el [fecha]. ¿Qué opciones tienen?" |
| Cómo llegar / ingreso | "Hola, ¿me indican cómo es el ingreso?" |

## 5. Visita presencial

Cada sitio debe invitar a conocer el lugar en al menos tres puntos (presentación o galería, ubicación y cierre).

CTA admitidos: Conocer las instalaciones · Explorar las habitaciones · Cómo llegar · Ver en el mapa · Planificar tu visita · Consultar condiciones de ingreso.

Reglas:
- Usa el enlace de mapas o la dirección **verificados**; si faltan, marcador `[DIRECCION_PENDIENTE]` / `[MAPA_PENDIENTE]`.
- No prometas acceso inmediato, disponibilidad garantizada, ni condiciones de ingreso no confirmadas (edad, documento, pago, horario).
- Lenguaje de invitación, no de presión: "Pasa a conocerlo" > "Ven ya".
- Relaciona la visita con un beneficio ("elige con calma", "ve la suite antes de decidir").

## 6. Prohibido en CTA

- Urgencia o escasez inventada ("¡Solo hoy!", "Quedan 2"), contadores o descuentos ficticios.
- CTA vagos ("Haz clic aquí", "Más información") cuando puede decirse qué ocurre.
- Más de tres botones compitiendo en la misma vista.
- Prometer respuesta inmediata o disponibilidad confirmada.
