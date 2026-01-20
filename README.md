# Sistema de Gestión de Inventario

Sistema completo de gestión de inventario desarrollado con Spring Boot y Angular, siguiendo las mejores prácticas de desarrollo.

## 🚀 Stack Tecnológico

### Backend
- **Java 17+**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **MySQL**
- **Maven**
- **Lombok**

### Frontend
- **Angular 17** (Standalone Components)
- **Bootstrap 5**
- **TypeScript**
- **RxJS**

## 📋 Requisitos Previos

- Java 17 o superior
- Maven 3.6+
- Node.js 18+ y npm
- MySQL 8.0+
- Angular CLI 17+

## 🛠️ Instalación y Configuración

### 1. Configuración de la Base de Datos

1. Crea una base de datos MySQL:
```sql
CREATE DATABASE inventory_db;
```

2. Actualiza las credenciales en `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```

### 2. Backend (Spring Boot)

1. Navega al directorio del backend:
```bash
cd backend
```

2. Compila el proyecto:
```bash
mvn clean install
```

3. Ejecuta la aplicación:
```bash
mvn spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

### 3. Frontend (Angular)

1. Navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta la aplicación:
```bash
ng serve
```

El frontend estará disponible en: `http://localhost:4200`

## 📁 Estructura del Proyecto

```
e-commerce/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/inventory/
│   │   │   │   ├── entity/          # Entidades JPA
│   │   │   │   ├── repository/      # Repositorios Spring Data
│   │   │   │   ├── service/         # Lógica de negocio
│   │   │   │   ├── controller/      # Controladores REST
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── mapper/          # Mappers DTO-Entity
│   │   │   │   └── exception/       # Manejo de excepciones
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/          # Componentes Angular
    │   │   ├── services/            # Servicios HTTP
    │   │   ├── models/              # Modelos TypeScript
    │   │   └── app.component.ts
    │   ├── index.html
    │   ├── main.ts
    │   └── styles.css
    ├── angular.json
    ├── package.json
    └── tsconfig.json
```

## 🎯 Funcionalidades

### CRUD Completo de Productos
- ✅ Crear productos
- ✅ Listar productos
- ✅ Editar productos
- ✅ Eliminar productos
- ✅ Búsqueda por nombre
- ✅ Filtrado por categoría
- ✅ Visualización de stock bajo

### Características Adicionales
- Validación de formularios (frontend y backend)
- Manejo de errores global
- Interfaz responsive con Bootstrap 5
- Indicadores visuales de stock
- Código limpio y bien estructurado

## 📡 API REST Endpoints

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Obtener todos los productos |
| GET | `/api/products/{id}` | Obtener producto por ID |
| POST | `/api/products` | Crear nuevo producto |
| PUT | `/api/products/{id}` | Actualizar producto |
| DELETE | `/api/products/{id}` | Eliminar producto |
| GET | `/api/products/search?name={name}` | Buscar productos por nombre |
| GET | `/api/products/category/{category}` | Filtrar por categoría |
| GET | `/api/products/low-stock?threshold={n}` | Productos con stock bajo |

## 🗄️ Modelo de Datos

### Product
- `id` (Long) - Identificador único
- `name` (String) - Nombre del producto (obligatorio)
- `description` (String) - Descripción del producto
- `price` (BigDecimal) - Precio (obligatorio)
- `stock` (Integer) - Cantidad en stock (obligatorio)
- `category` (String) - Categoría del producto
- `sku` (String) - Código SKU único
- `createdAt` (LocalDateTime) - Fecha de creación
- `updatedAt` (LocalDateTime) - Fecha de actualización

## 🔧 Configuración

### Variables de Entorno Backend

Edita `backend/src/main/resources/application.properties`:

```properties
# Base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/inventory_db
spring.datasource.username=root
spring.datasource.password=tu_contraseña

# Puerto del servidor
server.port=8080
```

### Variables de Entorno Frontend

El servicio HTTP está configurado para conectarse a `http://localhost:8080/api/products`. 
Puedes modificarlo en `frontend/src/app/services/product.service.ts`.

## 🧪 Pruebas

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
ng test
```

## 📝 Notas de Desarrollo

- El proyecto utiliza **Lombok** para reducir código boilerplate
- Los componentes Angular son **standalone** (sin módulos)
- Se implementa **DTO pattern** para separar la capa de presentación
- Manejo de errores centralizado con `GlobalExceptionHandler`
- Validaciones tanto en frontend como backend

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado siguiendo las mejores prácticas de Spring Boot y Angular.
