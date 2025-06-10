# Guía de Instalación y Configuración

## Requisitos del Sistema

### Software Necesario
- **Python**: 3.11 o superior
- **Node.js**: 20.0 o superior
- **pnpm**: 10.0 o superior (recomendado) o npm 9.0+
- **Git**: Para clonar el repositorio (opcional)

### Sistemas Operativos Compatibles
- Ubuntu 20.04+
- macOS 12.0+
- Windows 10+

## Instalación Paso a Paso

### 1. Preparación del Entorno

#### En Ubuntu/Linux:
```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Python 3.11 si no está disponible
sudo apt install python3.11 python3.11-venv python3.11-dev

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar pnpm
npm install -g pnpm
```

#### En macOS:
```bash
# Instalar Homebrew si no está instalado
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Python 3.11
brew install python@3.11

# Instalar Node.js 20
brew install node@20

# Instalar pnpm
npm install -g pnpm
```

#### En Windows:
1. Descargar e instalar Python 3.11 desde [python.org](https://www.python.org/downloads/)
2. Descargar e instalar Node.js 20 desde [nodejs.org](https://nodejs.org/)
3. Instalar pnpm: `npm install -g pnpm`

### 2. Configuración del Backend

```bash
# Navegar al directorio del backend
cd financial-planning-backend

# Crear entorno virtual (si no existe)
python3.11 -m venv venv

# Activar entorno virtual
# En Linux/macOS:
source venv/bin/activate
# En Windows:
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Verificar instalación
python src/main.py
```

**Salida esperada:**
```
 * Serving Flask app 'main'
 * Debug mode: on
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://[IP]:5000
```

### 3. Configuración del Frontend

```bash
# Abrir nueva terminal y navegar al directorio del frontend
cd financial-planning-frontend

# Instalar dependencias
pnpm install

# Verificar instalación
pnpm run dev
```

**Salida esperada:**
```
  VITE v6.3.5  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://[IP]:5173/
  ➜  press h + enter to show help
```

### 4. Verificación de la Instalación

1. **Backend**: Abrir `http://localhost:5000/api/health` en el navegador
   - Debe mostrar: `{"message": "Financial Planning API is running", "success": true, "version": "1.0.0"}`

2. **Frontend**: Abrir `http://localhost:5173` en el navegador
   - Debe mostrar la página principal de la aplicación

3. **Integración**: Completar un formulario y verificar que se generen recomendaciones

## Configuración Avanzada

### Variables de Entorno

#### Backend (.env)
```bash
# Crear archivo .env en financial-planning-backend/
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
CORS_ORIGINS=http://localhost:5173
```

#### Frontend (.env.local)
```bash
# Crear archivo .env.local en financial-planning-frontend/
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_TITLE=Financial Planning Platform
```

### Configuración de Puertos

#### Cambiar Puerto del Backend
```python
# En financial-planning-backend/src/main.py
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)  # Cambiar puerto aquí
```

#### Cambiar Puerto del Frontend
```bash
# En financial-planning-frontend/
pnpm run dev --port 3000
```

### Configuración de Base de Datos (Opcional)

Para implementar persistencia de datos:

```bash
# Instalar SQLAlchemy
pip install flask-sqlalchemy

# Configurar en main.py
from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///financial_planning.db'
db = SQLAlchemy(app)
```

## Solución de Problemas

### Problemas Comunes

#### 1. Error de Puerto en Uso
```bash
# Encontrar proceso usando el puerto
lsof -i :5000  # Para puerto 5000
lsof -i :5173  # Para puerto 5173

# Terminar proceso
kill -9 [PID]
```

#### 2. Error de Dependencias de Python
```bash
# Limpiar caché de pip
pip cache purge

# Reinstalar dependencias
pip uninstall -r requirements.txt -y
pip install -r requirements.txt
```

#### 3. Error de Dependencias de Node
```bash
# Limpiar caché de pnpm
pnpm store prune

# Reinstalar dependencias
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 4. Error de CORS
Verificar que el backend esté configurado para permitir solicitudes desde el frontend:
```python
# En main.py
from flask_cors import CORS
CORS(app, origins=['http://localhost:5173'])
```

#### 5. Error de Permisos (Linux/macOS)
```bash
# Dar permisos de ejecución
chmod +x financial-planning-backend/src/main.py
```

### Logs y Depuración

#### Backend
```bash
# Ejecutar con logs detallados
FLASK_DEBUG=True python src/main.py
```

#### Frontend
```bash
# Ejecutar con logs detallados
pnpm run dev --debug
```

### Verificación de Salud del Sistema

#### Script de Verificación
```bash
#!/bin/bash
# health_check.sh

echo "Verificando Backend..."
curl -s http://localhost:5000/api/health | grep -q "success" && echo "✅ Backend OK" || echo "❌ Backend Error"

echo "Verificando Frontend..."
curl -s http://localhost:5173 | grep -q "Financial Planning" && echo "✅ Frontend OK" || echo "❌ Frontend Error"
```

## Despliegue en Producción

### Preparación para Producción

#### Backend
```bash
# Instalar servidor WSGI
pip install gunicorn

# Ejecutar con Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 src.main:app
```

#### Frontend
```bash
# Construir para producción
pnpm run build

# Servir archivos estáticos
pnpm run preview
```

### Configuración de Nginx (Opcional)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Mantenimiento

### Actualizaciones
```bash
# Actualizar dependencias de Python
pip list --outdated
pip install --upgrade [package_name]

# Actualizar dependencias de Node
pnpm update
```

### Respaldos
```bash
# Respaldar configuración
tar -czf backup-$(date +%Y%m%d).tar.gz financial-planning-backend/src/data/
```

### Monitoreo
```bash
# Verificar uso de recursos
htop
df -h
free -h
```

## Soporte

Para problemas técnicos:
1. Verificar logs de error
2. Consultar la documentación
3. Revisar issues conocidos
4. Contactar al equipo de desarrollo

---

**Nota**: Esta guía asume un entorno de desarrollo. Para producción, considere implementar medidas adicionales de seguridad y monitoreo.

