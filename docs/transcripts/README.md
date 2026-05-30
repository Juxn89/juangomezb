# 🔄 Backup de Transcripts de Conversación

Esta carpeta contiene los transcripts completos de las sesiones de desarrollo con AI Agent.

## 📋 Formato

Los transcripts están en formato **JSONL** (JSON Lines), donde cada línea es un objeto JSON que representa un evento de la conversación.

### Tipos de Eventos
- `session.start` - Inicio de sesión
- `user.message` - Mensaje del usuario
- `assistant.message` - Respuesta del asistente
- `assistant.turn_start` / `assistant.turn_end` - Turnos de conversación
- `tool.execution_start` / `tool.execution_complete` - Ejecución de herramientas

## 📂 Archivos

### `session-main.jsonl`
- **Session ID**: c29bb278-94c9-4ad7-8957-e1c658b18fde
- **Fecha**: 2026-05-23 a 2026-05-30
- **Descripción**: Sesión principal de desarrollo del portfolio v2.0
- **Total de eventos**: 5788+ líneas
- **Status**: Completa

## 🔍 Cómo Leer los Transcripts

### Herramientas Recomendadas
1. **VS Code**: Abrir con extensión JSON
2. **jq**: Tool CLI para procesar JSON
   ```bash
   # Ver mensajes del usuario
   cat session-main.jsonl | jq -r 'select(.type=="user.message") | .data.content'
   
   # Ver mensajes del asistente
   cat session-main.jsonl | jq -r 'select(.type=="assistant.message") | .data.content'
   ```
3. **Python**: Script para analizar
   ```python
   import json
   
   with open('session-main.jsonl', 'r', encoding='utf-8') as f:
       for line in f:
           event = json.loads(line)
           if event['type'] == 'user.message':
               print(f"User: {event['data']['content']}")
   ```

## ⚠️ Nota Importante

**Estos archivos son solo para referencia y recuperación de contexto.**

- No contienen información sensible (API keys, passwords)
- Están versionados en Git para preservación
- Pueden ser grandes (varios MB)
- Útiles para entender decisiones pasadas
- Permite reconstruir el contexto completo

## 🚀 Cómo Usar Después de Formatear

1. Clonar el repositorio
2. Navegar a `docs/transcripts/`
3. Revisar `CONVERSATION_HISTORY.md` para resumen estructurado
4. Revisar archivos `.jsonl` para detalles específicos si es necesario

## 📚 Documentación Relacionada

Para una versión más legible del historial, consultar:
- **CONVERSATION_HISTORY.md** (raíz del proyecto) - Resumen estructurado y legible
- **DEVELOPMENT.md** (raíz del proyecto) - Contexto completo de desarrollo
- **SETUP.md** (raíz del proyecto) - Guía de configuración

---

**Mantenido por**: Juan Gomez (@juxn89)  
**Última actualización**: 2026-05-30
