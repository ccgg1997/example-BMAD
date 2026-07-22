# Epic 1 Fundamento, Autenticación y Registro de Salida

Establecer la infraestructura base del proyecto (repositorio, base de datos, despliegue), proteger el acceso con una clave compartida, sembrar los datos iniciales de repartidores, y entregar el flujo completo de registro de salida: un repartidor selecciona su nombre, ingresa los números de pedido que se lleva, y el sistema los guarda impidiendo que un mismo pedido quede asignado a dos repartidores a la vez.

## Story 1.1 Configuración base del proyecto y despliegue

As a propietario de la droguería,
I want que exista una aplicación web desplegada y accesible desde un celular,
so that el equipo pueda empezar a usar el sistema desde el primer día sin depender de instalaciones.

### Acceptance Criteria

1: El repositorio del proyecto está creado con la estructura de proyecto único Next.js definida en Technical Assumptions y Architecture.
2: La aplicación está desplegada vía Docker Compose (app + PostgreSQL + Caddy como reverse proxy con HTTPS) en un entorno accesible por URL desde un navegador móvil.
3: Existe un endpoint de verificación (`/api/health`) que confirma que la aplicación y su conexión a base de datos están funcionando.
4: La base de datos relacional está aprovisionada, conectada a la aplicación, y con las migraciones iniciales de Prisma aplicadas.
5: El pipeline de CI/CD (GitHub Actions) está configurado: corre pruebas en cada push y despliega automáticamente a producción al hacer merge a main.
6: Los frameworks de testing (Vitest + React Testing Library) están instalados y configurados, con al menos una prueba de ejemplo pasando.
7: Tailwind CSS y shadcn/ui están instalados y configurados como base de estilos para las siguientes historias.

## Story 1.2 Autenticación con Password Compartida

As a propietario de la droguería,
I want que la aplicación pida una clave antes de dejar entrar a cualquiera,
so that el sistema no quede abierto a cualquiera que encuentre la URL en internet.

### Acceptance Criteria

1: Existe una pantalla de login que pide una única clave (password compartida, sin usuarios individuales).
2: Si la clave es correcta, se otorga una sesión (cookie firmada, httpOnly, secure) que da acceso a las demás pantallas.
3: Si la clave es incorrecta, se muestra un mensaje de error y no se otorga sesión.
4: Cualquier pantalla del sistema (Registro de Salida, Resumen de Domicilios, Detalle por Repartidor) redirige a login si no hay sesión válida.
5: La clave se configura mediante variable de entorno, no está escrita en el código.
6: Existe un límite de intentos de login por minuto para dificultar ataques de fuerza bruta sobre la clave única.

## Story 1.3 Modelo de datos de repartidores y pedidos

As a desarrollador del sistema,
I want un modelo de datos que represente repartidores y registros de salida de pedidos,
so that el sistema pueda guardar y consultar de forma confiable quién lleva cada pedido.

### Acceptance Criteria

1: Existe una entidad Repartidor con al menos nombre e identificador único.
2: Existe una entidad Pedido/Registro de Salida con repartidor asignado, número de pedido, y fecha/hora de registro.
3: El número de pedido no se reinicia por día (ver FR8); el modelo garantiza unicidad del número de pedido a nivel de todo el sistema o de un rango temporal definido con el propietario.
4: La tarifa por domicilio es un valor configurable (ver FR7), no un valor fijo en código.
5: Existe un script de seed que crea los repartidores iniciales conocidos hoy (Carlos, Diego, Andrés) y la fila inicial de tarifa ($1.000 COP), de forma que la Story 1.4 tenga datos reales con los que probar.

## Story 1.4 Pantalla de Registro de Salida

As a repartidor,
I want seleccionar mi nombre e ingresar los números de los pedidos que me llevo,
so that quede registrado rápidamente qué pedidos tengo, sin llenar formularios largos.

### Acceptance Criteria

1: La pantalla permite seleccionar el nombre del repartidor de una lista, sin escribir texto libre.
2: La pantalla permite agregar uno o varios números de pedido antes de confirmar.
3: Al presionar "Registrar salida", los pedidos ingresados quedan guardados con el repartidor y la fecha/hora actual.
4: El flujo completo (seleccionar repartidor + ingresar pedidos + confirmar) toma menos de 15 segundos en un caso típico de 1 a 3 pedidos (ver NFR1).
5: La interfaz es usable desde un navegador móvil (ver NFR2).
6: La pantalla solo es accesible con sesión válida (ver Story 1.2); sin sesión, redirige a login.

## Story 1.5 Validación de doble asignación de pedidos

As a propietario de la droguería,
I want que el sistema impida que un mismo número de pedido sea registrado por dos repartidores distintos,
so that no se repita la confusión de no saber quién tiene realmente un pedido.

### Acceptance Criteria

1: Si un repartidor intenta registrar un número de pedido ya asignado a otro repartidor, el sistema rechaza el registro de ese número.
2: El sistema muestra un mensaje claro indicando que el pedido ya fue asignado y a quién.
3: Los demás números de pedido válidos en el mismo intento de registro sí se guardan correctamente (un conflicto no bloquea el resto del lote).
