import { createContext, ReactNode, useReducer, useState } from 'react'
import { ActionTypes, Cycle, cyclesReducer } from '../reducers/cycles'
interface CreateCycleData {
  task: string
  minutesAmount: number
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

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  // state - valor atual, em tempo real | action - ação que o usuário está querendo fazer
  // dispatch - metodo para disparar action e não mais alterar o valor de cycles
  // a função passada no reducer vira um ponto central, onde consigo manipular as ações realizadas
  // onde é feito a distinção através do type passado pelo dispatch e assim filtrando qual ação será realizada
  const [cyclesState, dispatch] = useReducer(
    // função vem lá do cycles na pasta reducers
    cyclesReducer,
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
      type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
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
      type: ActionTypes.ADD_NEW_CYCLE,
      payload: {
        newCycle,
      },
    })

    // copia todos os ciclos que já tem e adiciona o novo no final
    // sempre que uma alteração de estado depender de um valor anterior, utilizar em formato de arrow
    // setCycles((state) => [...state, newCycle])
    // para evitar o bug do timer começar nos segundos do timer anterior
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch({
      type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
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
