# 📸 Fotaza2

Trabajo Práctico Integrador - Programación Web II

## Descripción

Fotaza2 es una aplicación web que permite a los usuarios compartir fotografías, interactuar mediante comentarios, valoraciones y seguimiento de perfiles.



# La aplicación fue desarrollada utilizando:
-Node.js
-Express
-Pug
-sequelize
-Bootstrap
-PostgresSQL
-Express session


# Funcionalidades implementadas

## Usuarios

- Registro de usuarios
- Inicio de sesión
- Cierre de sesión
- Perfil de usuario
- Visualización de seguidores
- Visualización de usuarios seguidos
- Seguimiento de usuarios

## Publicaciones

- Crear publicaciones
- Agregar descripción
- Agregar múltiples imágenes
- Asociar hashtags
- Ver detalle de publicación

## Comentarios

- Comentar imágenes
- Visualizar comentarios

## Valoraciones

- Valorar publicaciones
- Una valoración por usuario
- Actualización de valoración existente
- Cálculo de promedio de valoraciones

## Búsqueda

- Búsqueda por hashtag
- Búsqueda por texto en publicaciones


# Instalación

## 1. Clonar repositorio

```bash
git clone https://github.com/josemir01/Fotaza2.git
```

## 2. Instalar dependencias

```bash
npm install
```

## 3. Configurar variables de entorno

Crear archivo:

```env
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=5432

PORT=3000
```

### 4. Inicializar la base de datos

```bash
npm run db:init
```

## 5. Ejecutar aplicación

```bash
npm start
```

La aplicación estará disponible en:

```text
http://localhost:3000
```

## Usuarios para probar

maria@test2.com -> 123456
juan@test.com -> 123456
gonzalo@test.com ->123456




## Observaciones

la barra de busqueda por texto de momento solo busca por titulo
ademas de tener un filtro de busqueda por hashtag

