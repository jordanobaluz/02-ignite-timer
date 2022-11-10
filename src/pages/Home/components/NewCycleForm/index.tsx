import { zodResolver } from '@hookform/resolvers/zod'
import { FormContainer, MinutesAmoutInput, TaskInput } from './styles'
import * as zod from 'zod'
import { useForm } from 'react-hook-form'

/* Prop Drilling -> muitas propriedades apenas para comunicação entre componentes */

const newCycleFormValidationSchema = zod.object({
  // valida se taskInput foi preenchido com no min 1 caractere
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(1).max(60),
})

// interface NewCycleFormData {
//   task: string
//   minutesAmout: number
// }
// quando criar tipagem a partir de outra referência, melhor usar type
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>
// está sendo feito uma interface de forma automatica utilizando zod

export function NewCycleForm() {
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })
  return (
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
        min={1}
        max={60}
        disabled={!!activeCycle} // !! converte para boolean
        {...register('minutesAmount', { valueAsNumber: true })}
      />
      <span>minutos.</span>
    </FormContainer>
  )
}
