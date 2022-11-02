import styled from 'styled-components'

export const HistoryContainer = styled.main`
  flex: 1;
  padding: 3.5rem;

  display: flex;
  flex-direction: column;

  h1 {
    font-size: 1.5rem;
    color: ${(props) => props.theme['gray-100']};
  }
`
export const HistoryList = styled.div`
  flex: 1;
  overflow: auto; /* gera a barra de rolagem quando o tamanho da tabela for maior que o tamanho do container */
  margin-top: 2rem;

  table {
    width: 100%;
    border-collapse: collapse; /* conta somente 1 borda */
    min-width: 600px;

    th {
      background-color: ${(props) => props.theme['gray-600']};
      padding: 1rem;
      text-align: left;
      color: ${(props) => props.theme['gray-100']};
      font-size: 0.875rem;
      line-height: 1.6;

      /* aplica o estilo somente a primeira e ultima coluna */
      &:first-child {
        border-top-left-radius: 8px;
        padding-left: 1.5rem;
      }

      &:last-child {
        border-top-right-radius: 8px;
        padding-right: 1.5rem;
      }
    }

    td {
      background-color: ${(props) => props.theme['gray-700']};
      border-top: 4px solid ${(props) => props.theme['gray-800']};
      padding: 1rem;
      font-size: 0.875rem;
      line-height: 1.6;

      &:first-child {
        width: 50%;
        padding-left: 1.5rem;
      }

      &:last-child {
        padding-right: 1.5rem;
      }
    }
  }
`

const STATUS_COLORS = {
  yellow: 'yellow-500',
  green: 'green-500',
  red: 'red-500',
} as const
/* as const define que o conteudo de status_colors não irá mudar, para não gerar falha de leitura com as informações em default_theme */

interface StatusProps {
  statusColor: keyof typeof STATUS_COLORS
}
/* mesma coisa de "yellow" | "green" | "red" */
/* as cores são as key, usado typeof pois o ts só consegue ler a tipagem e não o objeto js */

export const Status = styled.span<StatusProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  /* bolinha que é exibida antes do status */
  &::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: ${(props) => props.theme[STATUS_COLORS[props.statusColor]]};
  }
`
