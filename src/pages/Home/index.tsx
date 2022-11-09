import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
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

/*
controlled - mantem em tempo real a informação do input guardada no estado
uncontrolled - busca a informação do input somente quando precisar
schema - definir um formato e validar os dados por esse formato
*/

const newCycleFormValidationSchema = zod.object({
  // valida se taskInput foi preenchido com no min 1 caractere
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5).max(60),
})

// interface NewCycleFormData {
//   task: string
//   minutesAmout: number
// }
// quando criar tipagem a partir de outra referência, melhor usar type
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>
// está sendo feito uma interface de forma automatica utilizando zod

// define o formato dos ciclos, que é adicionado
interface Cycle {
  id: string
  task: string
  minutesAmout: number
  startDate: Date // armazena a data que foi ativo para saber quanto tempo passou
  interruptedDate?: Date // armazena data que foi interrompido manualmente o ciclo
}

export function Home() {
  // armazena uma lista de ciclos com o generic do ts
  const [cycles, setCycles] = useState<Cycle[]>([])
  // armazena os ciclos ativos
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  // armazena os segundos que passaram desde que foi criado o ciclo
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })
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

  // monitora o ciclo ativo para ativar o timer quando clicado no button
  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPassed(
          // usar sempre data nova no primeiro parametro
          differenceInSeconds(new Date(), activeCycle.startDate),
        )
      }, 1000)
    }

    // serve para resetar o que estava sendo feito no useEffect anteriormente
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle])

  function handleInterruptCycle() {
    // anota dentro do ciclo se foi interrompido, para ter no historico
    setCycles(
      cycles.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  const totalSeconds = activeCycle ? activeCycle.minutesAmout * 60 : 0
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

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            disabled={!!activeCycle} // !! converte para boolean
            {...register('task')}
          />
          {/* uso de spread ... para descontruir as funções e passar como propriedades do componente */}

          {/* lista de sugestões para input */}
          <datalist id="task-suggestions">
            <option value="Projeto 1"></option>
            <option value="Projeto 2"></option>
          </datalist>

          <label htmlFor="minutesAmout">durante</label>
          <MinutesAmoutInput
            type="number"
            id="minutesAmout"
            placeholder="00"
            step={5} /* pula de 5 em 5 ao clicar */
            min={5}
            max={60}
            disabled={!!activeCycle} // !! converte para boolean
            {...register('minutesAmount', { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

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
