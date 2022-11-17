import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// usar esse metodo de importação somente quando lib não tiver export default
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmoutInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from './styles'
import { useEffect, useState } from 'react'

import { differenceInSeconds } from 'date-fns'
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

export function Home() {
  // armazena uma lista de ciclos com o generic do ts
  const [cycles, setCycles] = useState<Cycle[]>([])
  // armazena os ciclos ativos
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

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

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
  // armazena os minutos e segundos que restam
  const minutesAmout = Math.floor(currentSeconds / 60)
  const secondsAmout = currentSeconds % 60

  // preenche os minutos com até 2 caracteres, se não tiver preencher com 0
  const minutes = String(minutesAmout).padStart(2, '0')
  const seconds = String(secondsAmout).padStart(2, '0')

  // exibe o timer no titulo da aba, para quando trocar de aba continuar acompanhando o timer
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  // observa se taskInput foi preenchido para habilitar StartCountdownButton
  const task = watch('task')
  const isSubmitDisabled = !task

  console.log(cycles)

  /* Prop Drilling -> MUITAS propriedades APENAS para comunicação entre componentes
    Context API -> Permite compartilhar informações entre vários componentes ao mesmo tempo
    createContext -> Permite criar variaveis que serão compartilhadas entre os componentes
    useContext -> Permite manipular a variavel de contexto, que geralmente é criada como objeto
    Variavel de estado -> Necessária quando trabalhar com váriaveis que precisam ser alteradas via contexto
  */

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <NewCycleForm />
        <CountDown
          activeCycle={activeCycle}
          setCycles={setCycles}
          activeCycleId={activeCycleId}
        />
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
