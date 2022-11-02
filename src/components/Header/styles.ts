import styled from 'styled-components'

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  nav {
    display: flex;
    gap: 0.5rem;

    a {
      /*definido o tamanho fixo pois no figma estava definido em 40px*/
      width: 3rem;
      height: 3rem;

      display: flex;
      justify-content: center;
      align-items: center;

      color: ${(props) => props.theme['gray-100']};

      /*essas propriedades irão evitar do ícone sair do lugar quando o mouse passar por cima*/
      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;

      &:hover {
        border-bottom: 3px solid ${(props) => props.theme['green-500']};
      }

      /*deixa os ícone timer e history verdes quando selecionados*/
      &.active {
        color: ${(props) => props.theme['green-500']};
      }
    }
  }
`
