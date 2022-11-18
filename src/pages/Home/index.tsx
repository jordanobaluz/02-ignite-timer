import { HandPalm, Play } from 'phosphor-react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

// usar esse metodo de importação somente quando lib não tiver export default
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { createContext, useState } from 'react'

import { NewCycleForm } from './components/NewCycleForm'
import { CountDown } from './components/CountDown'

/*
controlled - mantem em tempo real a informação do input guardada no estado
uncontrolled - busca a informação do input somente quando precisar
schema - definir um formato e validar os dados por esse formato
*/

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
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
}
export const CyclesContext = createContext({} as CyclesContextTypes)

const newCycleFormValidationSchema = zod.object({
  // valida se taskInput foi preenchido com no min 1 caractere
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(1).max(60),
})

// quando criar tipagem a partir de outra referência, melhor usar type
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>
// está sendo feito uma interface de forma automatica utilizando zod

export function Home() {
  // armazena uma lista de ciclos com o generic do ts
  const [cycles, setCycles] = useState<Cycle[]>([])
  // armazena os ciclos ativos
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  // armazena os segundos que passaram desde que foi criado o ciclo
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

  // register recebe nome do input e retorna metodos para trabalhar com input
  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmout: data.minutesAmount,
      startDate: new Date(),
    }

    // copia todos os ciclos que já tem e adiciona o novo no final
    // sempre que uma alteração de estado depender de um valor anterior, utilizar em formato de arrow
    setCycles((state) => [...state, newCycle])
    // quando se cria um novo ciclo, seta o ciclo recem criado como activo
    setActiveCycleId(id)
    // para evitar o bug do timer começar nos segundos do timer anterior
    setAmountSecondsPassed(0)
    // limpa os campos, voltando os valores que estão definidos em defaultValues
    reset()
  }

  // percorre e procura os ciclos que estão ativos
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function handleInterruptCycle() {
    // anota dentro do ciclo se foi interrompido, para ter no historico
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  // observa se taskInput foi preenchido para habilitar StartCountdownButton
  const task = watch('task')
  const isSubmitDisabled = !task

  console.log(cycles)

  /* Prop Drilling -> MUITAS propriedades APENAS para comunicação entre componentes
    Context API -> Permite compartilhar informações entre vários componentes ao mesmo tempo
    createContext -> Permite criar variaveis que serão compartilhadas entre os componentes
    useContext -> Permite manipular a variavel de contexto, que geralmente é criada como objeto
    Variavel de estado -> Necessária quando trabalhar com váriaveis que precisam ser alteradas via contexto
    Por padrão a preferencia é passagem por propriedades e não contexto
  */

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
            amountSecondsPassed,
            setSecondsPassed,
          }}
        >
          {/* Esse provider precisa estar por volta do componente que irá usar useFormContext */}
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <CountDown />
        </CyclesContext.Provider>
        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
      {/* form por volta de tudo para o button poder enviar as informações */}
    </HomeContainer>
  )
}
