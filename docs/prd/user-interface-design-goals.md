# User Interface Design Goals

## Overall UX Vision

Una interfaz mínima, de muy pocos pasos, pensada para usarse de pie y con prisa en la puerta de la droguería. Prioriza botones grandes y listas de selección sobre formularios de texto libre, evitando cualquier campo que no sea estrictamente necesario para registrar una salida o consultar el resumen.

## Key Interaction Paradigms

- Selección por toque (nombre del repartidor, no texto libre) para minimizar errores de escritura.
- Ingreso de números de pedido como lista corta (agregar/quitar), no como formulario extenso.
- Confirmación inmediata y visible al registrar la salida ("Registrado" o mensaje de conflicto si el pedido ya fue tomado).
- Resumen de domicilios como vista de solo lectura, sin pasos adicionales de navegación.

## Core Screens and Views

- Pantalla de Registro de Salida (selección de repartidor + números de pedido + botón "Registrar salida")
- Pantalla de Resumen de Domicilios (lista de repartidores con conteo y valor a pagar)
- Vista de Detalle por Repartidor (números de pedido registrados a su nombre)

## Accessibility: None

Sin requerimientos formales de accesibilidad (WCAG) para este MVP dado el contexto de uso (equipo interno reducido); se recomienda buen contraste y tamaños de toque grandes por buenas prácticas, sin ser un requisito formal.

## Branding

Validado con mockups de alta fidelidad (`mockups/mockup1.png`, `mockups/mockup2.png`): logo de ícono casa con cruz + nombre "Domicilios San Pedro" (subtítulo "Droguería"), paleta verde/teal como color primario (éxito, elementos activos), rojo/rosa para conflictos. Detalle completo en `docs/front-end-spec.md`, sección Branding & Style Guide.

## Target Device and Platforms: Web Responsive

Aplicación web responsive, accesible desde el navegador de un celular o de una tableta ubicada cerca de la salida — sin requerir instalación.
