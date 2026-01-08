# AGENTS.md - Code Vault Project

## 🎯 CONTEXTO DEL PROYECTO

**Code Vault** es una plataforma moderna para gestionar snippets de código con capacidades sociales, colaborativas y de productividad. Este documento define las reglas que todos los agentes IA deben seguir al trabajar en este proyecto.

---

## 🏗️ ARQUITECTURA Y ORGANIZACIÓN

### Estructura del Proyecto (Screaming Architecture)

```
src/
├── app/                    # Next.js App Router
│   ├── auth/            # Rutas de autenticación
│   ├── (dashboard)/       # Rutas protegidas
│   └── api/               # API routes
├── modules/               # Features/Dominios
│   ├── auth/             # Autenticación y autorización
│   ├── snippets/         # Gestión de snippets
│   ├── collections/      # Colecciones/folders
│   ├── tags/             # Sistema de etiquetas
│   ├── users/            # Perfiles y preferencias
│   ├── social/           # Likes, comments, follows
│   └── editor/           # Editor de código
├── components/           # Componentes UI compartidos
│   ├── ui/              # shadcn/ui components
│   └── layout/          # Layout components
├── lib/                 # Utilidades y configuración
│   ├── prisma.ts       # Cliente Prisma
│   ├── auth.ts         # Configuración auth
│   └── utils.ts        # Helpers generales
└── types/              # Tipos TypeScript globales
```

### Organización de Módulos

Cada módulo debe contener:

```
module-name/
├── components/       # UI components específicos del módulo
├── hooks/           # React hooks personalizados
├── helpers/         # Funciones puras y utilidades
├── actions/         # Server Actions de Next.js
├── types/           # TypeScript types e interfaces
├── schemas/         # Esquemas Zod para validación
└── constants.ts     # Constantes del módulo
```

---

## 📐 CONVENCIONES DE NOMENCLATURA

### Archivos

```typescript
// Components (kebab-case)
snippet - card.tsx;
code - editor.tsx;
user - profile - form.tsx;

// Hooks (camelCase con prefijo 'use')
useSnippetEditor.ts;
useCollectionManager.ts;
useRealTimeSync.ts;

// Helpers (kebab-case)
format - date.ts;
syntax - highlighter.ts;
code - analyzer.ts;

// Actions (kebab-case)
create - snippet.ts;
update - collection.ts;
delete -comment.ts;

// Types (kebab-case)
index.ts;
snippet.ts;
user.ts;

// Schemas (kebab-case)
snippet - schema.ts;
collection - schema.ts;
```

### Variables y Funciones

```typescript
// Variables (camelCase)
const snippetId = "abc123";
const userPreferences = {};
const isPublic = true;

// Funciones (camelCase)
function calculateComplexity() {}
function formatCodeBlock() {}
function validateSnippetData() {}

// Constantes (UPPER_SNAKE_CASE)
const MAX_SNIPPET_SIZE = 50000;
const DEFAULT_LANGUAGE = "javascript";
const CACHE_DURATION = 3600;

// Event Handlers (handle + PascalCase)
const handleSnippetSave = () => {};
const handleTagSelect = () => {};
```

### Tipos e Interfaces

```typescript
// Interfaces (PascalCase)
interface User {}
interface Snippet {}
interface Collection {}

// Types (PascalCase)
type SnippetVisibility = "public" | "private" | "unlisted";
type EditorTheme = "vs-dark" | "vs-light" | "hc-black";

// Enums (PascalCase)
enum Language {
  JavaScript = "javascript",
  TypeScript = "typescript",
  Python = "python",
}
```

---

## 🎨 PATRONES DE CÓDIGO

### 1. Orden de Importaciones

```typescript
// 1. Externos (React, Next.js, librerías)
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// 2. Configuración/Lib
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

// 3. Componentes UI
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 4. Módulos principales
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { createSnippet } from "@/modules/snippets/actions/create-snippet";

// 5. Types
import type { Snippet, SnippetFormData } from "@/modules/snippets/types";

// 6. Estilos (si aplica)
import styles from "./component.module.css";
```

### 2. Componentes React

```typescript
// Server Component (por defecto en Next.js 14+)
interface SnippetListProps {
  userId: string;
  limit?: number;
}

export async function SnippetList({ userId, limit = 10 }: SnippetListProps) {
  const snippets = await prisma.snippet.findMany({
    where: { userId },
    take: limit,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-4">
      {snippets.map((snippet) => (
        <SnippetCard key={snippet.id} snippet={snippet} />
      ))}
    </div>
  );
}

// Client Component (cuando sea necesario)
"use client";

interface CodeEditorProps {
  initialValue?: string;
  language: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ initialValue = "", language, onChange }: CodeEditorProps) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    // JSX...
  );
}
```

### 3. Server Actions

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { snippetSchema } from "../schemas/snippet-schema";
import type { SnippetFormData } from "../types";

/**
 * Creates a new code snippet
 * @param data - Snippet form data
 * @returns Created snippet or error
 */
export async function createSnippet(data: SnippetFormData) {
  try {
    // Validar con Zod
    const validatedData = snippetSchema.parse(data);

    // Crear snippet
    const snippet = await prisma.snippet.create({
      data: {
        ...validatedData,
        userId: data.userId,
      },
    });

    // Revalidar caché
    revalidatePath("/dashboard/snippets");

    return { success: true, data: snippet };
  } catch (error) {
    console.error("Error creating snippet:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
```

### 4. Hooks Personalizados

```typescript
"use client";

import { useState, useEffect } from "react";
import type { Snippet } from "../types";

/**
 * Hook para gestionar el estado del editor de snippets
 * Incluye auto-save, validación y sincronización
 */
export function useSnippetEditor(snippetId?: string) {
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (snippetId) {
      // Cargar snippet existente
      loadSnippet(snippetId);
    }
  }, [snippetId]);

  const loadSnippet = async (id: string) => {
    // Implementación...
  };

  const saveSnippet = async () => {
    setIsSaving(true);
    try {
      // Implementación...
    } finally {
      setIsSaving(false);
    }
  };

  return {
    content,
    setContent,
    language,
    setLanguage,
    isSaving,
    saveSnippet,
  };
}
```

### 5. Schemas con Zod

```typescript
import { z } from "zod";

export const snippetSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),

  description: z.string().max(500, "Description must be less than 500 characters").optional(),

  content: z.string().min(1, "Code content is required").max(50000, "Code must be less than 50KB"),

  language: z.string().min(1, "Language is required"),

  visibility: z.enum(["public", "private", "unlisted"]).default("private"),

  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").optional(),
});

export type SnippetFormData = z.infer<typeof snippetSchema>;
```

---

## 🎯 REGLAS DE DESARROLLO

### TypeScript

- **NUNCA usar `any`** - Usar `unknown` o tipos específicos
- **Tipos explícitos** en parámetros de funciones
- **Interfaces** para estructuras de datos
- **Types** para uniones y composiciones
- **Genéricos** cuando sea apropiado

```typescript
// ❌ Evitar
function processData(data: any) {
  return data.value;
}

// ✅ Correcto
function processData<T extends { value: string }>(data: T): string {
  return data.value;
}
```

### Manejo de Errores

```typescript
// Server Actions
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  console.error("Operation failed:", error);
  return {
    success: false,
    error: error instanceof Error ? error.message : "Unknown error",
  };
}

// Client Components
try {
  await someAsyncOperation();
} catch (error) {
  toast.error("Something went wrong");
  console.error(error);
}
```

### Validación de Datos

```typescript
// Siempre validar con Zod antes de procesar
import { snippetSchema } from "./schemas/snippet-schema";

export async function createSnippet(data: unknown) {
  // Validar primero
  const validatedData = snippetSchema.parse(data);

  // Procesar datos validados
  const snippet = await prisma.snippet.create({
    data: validatedData,
  });

  return snippet;
}
```

### Componentes UI

```typescript
// Usar shadcn/ui components como base
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

// Extender con variantes cuando sea necesario
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva("base-classes", {
  variants: {
    intent: {
      primary: "primary-classes",
      secondary: "secondary-classes",
    },
  },
});
```

---

## 🔒 SEGURIDAD Y VALIDACIÓN

### Input Sanitization

```typescript
import { sanitize } from "@/lib/sanitize";

// Sanitizar contenido user-generated
const safeContent = sanitize(userInput);

// Validar permisos antes de operaciones
if (snippet.userId !== currentUser.id) {
  throw new Error("Unauthorized");
}
```

### Row-Level Security

```typescript
// Filtrar automáticamente por userId
const snippets = await prisma.snippet.findMany({
  where: {
    userId: currentUser.id,
    // Otros filtros...
  },
});

// Para snippets públicos
const publicSnippets = await prisma.snippet.findMany({
  where: {
    visibility: "public",
  },
});
```

---

## 🎨 ESTILOS Y UI

### Tailwind CSS

```typescript
// Usar utility classes
<div className="flex items-center gap-4 p-4 rounded-lg border">
  <Button className="bg-primary hover:bg-primary/90">
    Save
  </Button>
</div>

// Usar cn() para clases condicionales
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  isDisabled && "disabled-classes"
)}>
```

### Animaciones con Framer Motion

```typescript
import { motion } from "framer-motion";

// Animaciones sutiles y rápidas
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
>
  {content}
</motion.div>
```

---

## 📝 DOCUMENTACIÓN

### JSDoc Comments

```typescript
/**
 * Creates a new code snippet with validation and auto-tagging
 *
 * @param data - Snippet form data including title, content, and metadata
 * @param userId - ID of the user creating the snippet
 * @returns Promise with created snippet or error
 *
 * @example
 * const result = await createSnippet({
 *   title: "React Hook",
 *   content: "const [state, setState] = useState()",
 *   language: "typescript"
 * }, "user-123");
 */
export async function createSnippet(data: SnippetFormData, userId: string): Promise<Result<Snippet>> {
  // Implementation...
}
```

### TODOs

```typescript
// TODO: Implementar rate limiting para prevenir spam
// TODO: Agregar compresión de contenido para snippets grandes
// FIXME: Corregir race condition en auto-save
// NOTE: Este código requiere Redis configurado
```

---

## 🚀 PERFORMANCE

### Optimizaciones Requeridas

```typescript
// Lazy loading de componentes
const CodeEditor = dynamic(() => import("./code-editor"), {
  loading: () => <EditorSkeleton />
});

// Pagination para listas grandes
const snippets = await prisma.snippet.findMany({
  take: 20,
  skip: page * 20,
  orderBy: { createdAt: "desc" }
});

// Optimistic updates en mutations
const updateSnippet = useMutation({
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['snippet', id]);

    // Snapshot previous value
    const previous = queryClient.getQueryData(['snippet', id]);

    // Optimistically update
    queryClient.setQueryData(['snippet', id], newData);

    return { previous };
  }
});
```

---

## ✅ CHECKLIST ANTES DE COMMIT

- [ ] Código compila sin errores TypeScript
- [ ] No hay `any` types sin justificación
- [ ] Validación Zod implementada en inputs
- [ ] Manejo de errores apropiado (try-catch)
- [ ] Componentes tienen tipos de props definidos
- [ ] Funciones tienen JSDoc si son complejas
- [ ] Estilos usan Tailwind (no CSS inline)
- [ ] Imports organizados correctamente
- [ ] Variables/funciones con nombres descriptivos
- [ ] Sin console.logs en producción

---

## 🎯 PRIORIDADES EN IMPLEMENTACIÓN

1. **Funcionalidad Core** - Que funcione correctamente
2. **TypeScript** - Tipado completo y correcto
3. **Validación** - Datos seguros con Zod
4. **UX** - Experiencia fluida y responsive
5. **Performance** - Optimizaciones cuando sea necesario
6. **Documentación** - Código auto-explicativo

---

## 🔗 RECURSOS

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zod](https://zod.dev)

---

**IMPORTANTE**: Estas son reglas estrictas. Cualquier desviación debe ser justificada y aprobada explícitamente. La consistencia es clave para mantener un código base escalable y mantenible.
