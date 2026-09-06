declare module "@hitechcloud/ui" {
  import type { ComponentType } from "react"

  export const Button: ComponentType<any>
  export const StatusDot: ComponentType<any>
}

declare module "@hitechcloud/ui/styles.css" {
  const href: string
  export default href
}
