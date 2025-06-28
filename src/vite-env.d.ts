/// <reference types="vite/client" />

// CSS modules
declare module '*.css' {
  const content: string
  export default content
}

// Images
declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
} 