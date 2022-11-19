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

import { NewCycleForm } from './components/NewCycleForm'
import { CountDown } from './components/CountDown'
import { useContext } from 'react'
import { CyclesContext } from '../../context/CyclesContext'

/*
controlled - mantem em tempo real a informação do input guardada no estado
uncontrolled - busca a informação do input somente quando precisar
schema - definir um formato e validar os dados por esse formato
*/

const newCycleFormValidationSchema = zod.object({
  // valida se taskInput foi preenchido com no min 1 caractere
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(1).max(60),
})

// quando criar tipagem a partir de outra referência, melhor usar type
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>
// está sendo feito uma interface de forma automatica utilizando zod

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext)
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  // observa se taskInput foi preenchido para habilitar StartCountdownButton
  const task = watch('task')
  const isSubmitDisabled = !task

  // aqui está com handle pois será chamada diretamente em um evento, chamando o evento passado por contexto sem gerar novos contextos desnecessários com o metodo reset
  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    // limpa os campos, voltando os valores que estão definidos em defaultValues
    reset()
  }

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
        {/* Esse provider precisa estar por volta do componente que irá usar useFormContext */}
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <CountDown />
        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
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
