export const LABELS = {
  lang: "es",
  title: "Panel de contenido",
  heading: "Panel de contenido",
  login: {
    title: "Iniciar sesión",
    heading: "Iniciar sesión",
    username: "Usuario",
    password: "Contraseña",
    submit: "Entrar",
    errors: {
      credenciales: "Usuario o contraseña incorrectos.",
      csrf: "El formulario caducó. Vuelve a intentarlo.",
      bloqueado: "Demasiados intentos. Espera {min} minuto(s) e inténtalo de nuevo.",
    },
  },
  home: {
    signedInAs: "Sesión iniciada como {usuario}",
    logout: "Cerrar sesión",
    logoutAria: "Cerrar la sesión actual",
  },
  notFound: {
    title: "Página no encontrada",
    heading: "Página no encontrada",
    back: "Volver al inicio",
  },
  errors: {
    unavailable: "Servicio no disponible.",
    unauthorized: "Se requiere iniciar sesión.",
    forbidden: "Petición no permitida.",
    methodNotAllowed: "Método no permitido.",
    payloadTooLarge: "La petición es demasiado grande.",
  },
} as const;
