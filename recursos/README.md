# recursos/

Entrada manual de material de cada cliente. Aquí **tú** dejas logos, fotos, textos y datos; el agente los lee con el prompt "Nuevo cliente desde una plantilla" y los usa para generar `sites/<slug-cliente>/`.

## Cómo usarla

1. Crea la carpeta del cliente con su slug (`kebab-case`):

   ```bash
   pnpm recursos:new <slug-cliente>
   ```

2. Rellena `recursos/<slug-cliente>/brief.md` (datos, contacto, marca, tono). Lo que no tengas, déjalo vacío: el agente lo marcará como pendiente y no inventará nada.
3. Pon los archivos en sus carpetas (ver abajo).
4. Lanza la generación sin supervisión (termina en un PR): `pnpm client:run <slug-cliente>` (prueba antes con `--dry-run`). Alternativa manual: `pnpm client-prompt <slug-cliente>` copia el prompt para pegarlo en Claude.

## Estructura de cada cliente

```text
recursos/<slug-cliente>/
├── brief.md                 # Datos del cliente, contacto, marca, tono y páginas
├── marca/
│   ├── logo.*               # Logo principal (svg/png), y variantes si existen
│   ├── favicon.*            # Favicon (svg/png/ico)
│   ├── og-image.*           # Imagen para compartir (1200x630)
│   └── fuentes/             # Fuentes .woff2 (si la marca usa fuentes propias)
├── fotos/
│   ├── hero/                # Portada / imágenes principales
│   ├── habitaciones/        # Una subcarpeta por habitación o suite (ej. suite-jacuzzi/)
│   ├── instalaciones/       # Fachada, recepción, parqueadero, áreas comunes
│   └── galeria/             # Resto de imágenes
├── textos/                  # Textos del cliente (.md/.txt/.docx), tarifas, FAQ, políticas
└── referencias/             # Capturas o enlaces de inspiración (solo referencia visual)
```

## Reglas

- **Nombres de archivo** en `kebab-case`, sin espacios ni tildes (`suite-jacuzzi-01.jpg`).
- **Fotos:** originales de la mejor calidad disponible; el agente las optimiza al copiarlas a `sites/<slug-cliente>/public/`. Agrupa por habitación y, si importa el orden, numera (`-01`, `-02`).
- **Sin secretos:** nada de contraseñas, tokens ni datos bancarios.
- **Git:** el contenido de cada cliente está ignorado por Git (pesado y de terceros). Solo se versionan este `README.md` y `_plantilla-cliente/`.
- **Solo lectura para el agente:** `pnpm optimize-assets <slug-cliente>` (que `client:run` ejecuta solo) copia y optimiza `marca/` y `fotos/` hacia `sites/<slug-cliente>/public/` y deja el mapa en `docs/research/<slug-cliente>/assets-manifest.json`; nadie modifica ni borra esta carpeta.
