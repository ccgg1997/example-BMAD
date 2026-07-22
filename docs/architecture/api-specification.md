# API Specification

## REST API Specification

```yaml
openapi: 3.0.0
info:
  title: Domicilios San Pedro API
  version: 0.1.0
  description: API interna para registro de salidas y resumen de domicilios
servers:
  - url: https://dominio-droguria.com/api
    description: Producción (VPS DigitalOcean)

paths:
  /auth/login:
    post:
      summary: Autenticarse con la clave compartida
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                password: { type: string }
      responses:
        "200": { description: Cookie de sesión emitida }
        "401": { description: Password incorrecta }

  /auth/logout:
    post:
      summary: Cerrar sesión
      responses:
        "200": { description: Cookie de sesión invalidada }

  /repartidores:
    get:
      summary: Listar repartidores activos
      responses:
        "200":
          description: Lista de repartidores
          content:
            application/json:
              schema:
                type: array
                items: { $ref: "#/components/schemas/Repartidor" }

  /registros:
    post:
      summary: Registrar salida de uno o varios pedidos para un repartidor
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                repartidorId: { type: string }
                numerosPedido:
                  type: array
                  items: { type: integer }
      responses:
        "201":
          description: Registro(s) creado(s); incluye detalle de conflictos si algún número ya estaba asignado
          content:
            application/json:
              schema:
                type: object
                properties:
                  creados: { type: array, items: { $ref: "#/components/schemas/RegistroSalida" } }
                  conflictos:
                    type: array
                    items:
                      type: object
                      properties:
                        numeroPedido: { type: integer }
                        asignadoA: { type: string }

  /resumen:
    get:
      summary: Resumen de domicilios agregado por repartidor
      responses:
        "200":
          description: Cantidad y valor a pagar por repartidor
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    repartidor: { $ref: "#/components/schemas/Repartidor" }
                    cantidad: { type: integer }
                    valorAPagar: { type: number }

  /repartidores/{id}/pedidos:
    get:
      summary: Detalle de pedidos registrados a un repartidor
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string }
      responses:
        "200":
          description: Lista de registros del repartidor
          content:
            application/json:
              schema:
                type: array
                items: { $ref: "#/components/schemas/RegistroSalida" }

components:
  schemas:
    Repartidor:
      type: object
      properties:
        id: { type: string }
        nombre: { type: string }
        activo: { type: boolean }
    RegistroSalida:
      type: object
      properties:
        id: { type: string }
        numeroPedido: { type: integer }
        repartidorId: { type: string }
        registradoEn: { type: string, format: date-time }
        tarifaAplicada: { type: number }
```
