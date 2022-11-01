/* .d.ts define que só terá código de definição de tipo ts, não pode ter código js */
import 'styled-components'
import { defaultTheme } from '../styles/themes/default'

type ThemeType = typeof defaultTheme

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}

/* assim é modificado a tipagem de temas para poder ter uma melhor integração do TypeScript */
