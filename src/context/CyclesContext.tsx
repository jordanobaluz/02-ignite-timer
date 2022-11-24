import { differenceInSeconds } from 'date-fns'
import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react'
import {
  ActionTypes,
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
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
    () => {
      const storedStateAsJSON = localStorage.getItem(
        '@ignite-timer: cycles-state-1.0.0',
      )
      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }
    },
  )

  const { cycles, activeCycleId } = cyclesState
  // percorre e procura os ciclos que estão ativos
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  // armazena os segundos que passaram desde que foi criado o ciclo
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }
    return 0
  })

  // irá armazenar as informações no localstorage
  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)
    // DICA -> sempre coloque um prefixo com o nome da aplicação
    // DICA -> colocar uma versão do que está sendo salvo
    localStorage.setItem('@ignite-timer: cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  // armazena os ciclos ativos
  // const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
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

    // chama a função que fica lá em actions passando o novo ciclo
    dispatch(addNewCycleAction(newCycle))

    // copia todos os ciclos que já tem e adiciona o novo no final
    // sempre que uma alteração de estado depender de um valor anterior, utilizar em formato de arrow
    // setCycles((state) => [...state, newCycle])
    // para evitar o bug do timer começar nos segundos do timer anterior
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
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
