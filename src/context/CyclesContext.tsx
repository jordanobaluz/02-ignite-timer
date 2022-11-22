import { createContext, ReactNode, useReducer, useState } from 'react'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

// define o formato dos ciclos, que é adicionado
interface Cycle {
  id: string
  task: string
  minutesAmout: number
  startDate: Date // armazena a data que foi ativo para saber quanto tempo passou
  interruptedDate?: Date // armazena data que foi interrompido manualmente o ciclo
  finishedDate?: Date
}

// define o tipo das informações que serão passadas por contexto
interface CyclesContextTypes {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextTypes)

// ReactNode é qualquer HTML, JSX valido, seja div, outro componente ou texto
interface CyclesContextProviderProps {
  children: ReactNode
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  // armazena uma lista de ciclos com o generic do ts
  // const [cycles, setCycles] = useState<Cycle[]>([])

  // state - valor atual, em tempo real | action - ação que o usuário está querendo fazer
  // dispatch - metodo para disparar action e não mais alterar o valor de cycles
  // a função passada no reducer vira um ponto central, onde consigo manipular as ações realizadas
  // onde é feito a distinção através do type passado pelo dispatch e assim filtrando qual ação será realizada
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      switch (action.type) {
        case 'ADD_NEW_CYCLE':
          return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id,
          }
        case 'INTERRUPT_CURRENT_CYCLE':
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, interruptedDate: new Date() }
              } else {
                return cycle
              }
            }),
            activeCycleId: null,
          }
        case 'MARK_CURRENT_CYCLE_AS_FINISHED':
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
            activeCycleId: null,
          }
        default:
          return state
      }
    },
    // inicialização agora é por objeto e o array vai dentro dele
    {
      cycles: [],
      activeCycleId: null,
    },
  )
  // armazena os segundos que passaram desde que foi criado o ciclo
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const { cycles, activeCycleId } = cyclesState
  // armazena os ciclos ativos
  // const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  // percorre e procura os ciclos que estão ativos
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId,
      },
    })
  }

  // register recebe nome do input e retorna metodos para trabalhar com input
  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmout: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    })

    // copia todos os ciclos que já tem e adiciona o novo no final
    // sempre que uma alteração de estado depender de um valor anterior, utilizar em formato de arrow
    // setCycles((state) => [...state, newCycle])
    // quando se cria um novo ciclo, seta o ciclo recem criado como activo
    // setActiveCycleId(id)
    // para evitar o bug do timer começar nos segundos do timer anterior
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        activeCycleId,
      },
    })
    // anota dentro do ciclo se foi interrompido, para ter no historico
  }

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
        cycles,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
