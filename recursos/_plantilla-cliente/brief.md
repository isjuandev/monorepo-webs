# Brief del cliente

> Rellena lo que tengas. Lo vacío o marcado como **Pendiente** se trata como pendiente: el agente no lo inventa y lo lista en el PR.
> Ejemplo completo y real: [`recursos/la-guaca/brief.md`](../la-guaca/brief.md). Guía de cada carpeta: [`recursos/README.md`](../README.md).
> Los comentarios `<!-- -->` son ayuda: el pipeline los ignora y puedes dejarlos.

## Generación

<!-- Obligatorio. Sin estos 6 campos pnpm client:run se detiene. -->

- Plantilla base: <!-- carpeta de sites/: _template o plantilla-* (ej. plantilla-asterre). Ver `ls sites` -->
- Slug (kebab-case): <!-- igual al nombre de esta carpeta (ej. la-guaca) -->
- Nombre comercial: <!-- ej. La Guaca (Motel La Guaca) -->
- Dominio: <!-- sin https:// (ej. laguaca.com). Si es temporal: "la-guaca.nexobite.com (temporal; dominio definitivo del cliente: Pendiente)" y lanza con --allow-pending -->
- Locale: <!-- es (es_CO) | en (en_US) -->
- Tipo de negocio: <!-- motel | hotel boutique | otro. "motel" activa la skill motel-copywriting y la rama cliente/motel-<slug> -->

## Tono (solo moteles, skill `motel-copywriting`)

- Estilo (1-10): <!-- 1 Romántico · 2 Sensual y de pasión · 3 Premium/lujo · 4 Económico · 5 Moderno y urbano · 6 Temático · 7 Discreto y privado · 8 Escapada/descanso · 9 Juvenil y dinámico (adultos) · 10 Jacuzzi/suites/experiencias. Ej: 10 Jacuzzi / suites / experiencias -->
- Tono principal (ID): <!-- ver .agents/skills/motel-copywriting/SKILL.md §3: R1-R5, S1-S5, P1-P5, E1-E5, U1-U5, T1-T5, D1-D5, X1-X5, J1-J5, K1-K5. Ej: K1 Protagonista: el jacuzzi -->
- Tono secundario (opcional, máx. 1, compatible con el principal): <!-- ej. K2 Suite-experiencia -->
- Persona gramatical: <!-- tú | usted | ustedes -->
- Público objetivo: <!-- ej. parejas y amigos, mayores de 18 años -->

## Contacto

- Teléfono: <!-- formato internacional: +57 320 727 4329 -->
- WhatsApp (con código de país): <!-- solo dígitos y el enlace: 573207274329 (https://wa.me/573207274329) -->
- Correo:
- Dirección: <!-- ej. Km 2 vía Montenegro, Armenia -->
- Enlace de mapa: <!-- Google Maps y, si hay, Waze: https://maps.app.goo.gl/… (Waze: https://waze.com/ul?ll=…&navigate=yes) -->
- Enlace de reservas: <!-- ej. https://wa.me/573207274329 (reserva por WhatsApp) -->
- Redes sociales: <!-- una por red: Facebook https://… · Instagram https://… · TikTok: Pendiente -->

## Horarios y condiciones

- Horarios: <!-- ej. abierto 24 horas, los 7 días de la semana -->
- Formas de pago: <!-- ej. efectivo; transferencia (Nequi, Daviplata, Bancolombia); tarjetas con datáfono en la habitación -->
- Políticas (edad, ingreso, cancelación):
  - Edad: <!-- ej. solo mayores de 18 años. -->
  - Ingreso: <!-- ej. parqueadero privado por habitación; entrega por torno o ventanilla, sin contacto visual. -->
  - Reservas: <!-- anticipación y abono, si aplica -->
  - Cancelación:

## Marca

- Colores (hex): primario / acento / fondo / texto <!-- ej. primario #e0303f / acento #b5121b / fondo #0b0909 / texto #f4ece4. Si no hay paleta escrita, se toman del logo: indícalo -->
- Tipografías: <!-- ej. Forum (títulos) y Almarai (texto), en marca/fuentes/. Indica si hay licencia -->
- Archivos: <!-- lista lo que dejaste en cada carpeta (ver recursos/README.md) -->
  - Logos y marca (`marca/`):
  - Fuentes (`marca/fuentes/`):
  - Fotos de ambiente (`fotos/hero/`):
  - Fotos de instalaciones (`fotos/instalaciones/`):
  - Galería general (`fotos/galeria/`):
  - Originales en alta: <!-- indica si son originales o versiones ya comprimidas -->

## Servicios incluidos en todas las habitaciones

<!-- Lo que se repite en cada habitación, una vez aquí (no lo repitas abajo). Ej: Jacuzzi privado · Aire acondicionado · TV LED y sonido · Nevera · Parqueadero privado · Room service 24/7 -->

-

## Restaurante / otros servicios

<!-- Horario, rango de precios y notas. Ej: "24 horas · platos desde $16.500 hasta $51.700 · servicio a la habitación (entrega privada)" -->

## Nota general de habitaciones

<!-- Texto que aplica a todas. Ej: "Cada habitación tiene su propio ambiente. ¿Tienes una favorita? Pídela por WhatsApp antes de llegar." -->

## Habitaciones

<!-- Un bloque "### " por habitación, de menor a mayor categoría. Solo lo EXCLUSIVO de cada una.
     El título define la URL y la carpeta de fotos: "### VIP Love Decorada" → /habitaciones/vip-love-decorada
     y fotos/habitaciones/vip-love-decorada/vip-love-decorada-01.webp, -02, …
     Duplica el bloque de abajo cambiando el título (sin los signos < >). -->

### <NOMBRE DE LA HABITACIÓN>

- Tarifa base: $ <!-- ej. 90.000 -->
- Duración incluida: <!-- ej. 5 horas -->
- Persona adicional: $
- Hora adicional: $
- Capacidad: <!-- ej. 2 personas -->
- Características propias:
  - <!-- ej. Columpio del amor -->
  - <!-- ej. Comedor para dos -->
- Restricciones o excepciones: <!-- ej. reserva con 24 horas de anticipación y abono por transferencia -->
- Fotos: `fotos/habitaciones/<nombre-habitacion>/` <!-- ej. (7 fotos: vip-love-01 a vip-love-07) -->
- Notas: <!-- ej. número 02 del catálogo -->

## Páginas

- Conservar de la plantilla: <!-- ej. inicio; habitaciones (catálogo y una por habitación); contacto; privacidad; términos; 404 -->
- Eliminar: <!-- páginas de la plantilla que no aplican -->
- Añadir: <!-- ej. carta del restaurante, promociones -->

## FAQ / promociones / notas

<!-- Preguntas reales del cliente en formato "¿Pregunta? Respuesta." y notas sueltas. -->

Preguntas frecuentes:

- <!-- ej. ¿Cuánto tiempo incluye la tarifa? Las VIP incluyen 5 horas; las decoradas, 6 horas. -->

Notas:

- <!-- ej. Promociones vigentes: Pendiente -->

## Cambios de diseño respecto a la plantilla

<!-- Opcional. Ej: CTA principal a WhatsApp en el encabezado; fotos de habitación en retrato (3:4 o 9:16); botón flotante de WhatsApp solo al pasar el hero. -->
