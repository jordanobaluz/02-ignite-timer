import { FormContainer, MinutesAmoutInput, TaskInput } from './styles'
import { useFormContext } from 'react-hook-form'
import { useContext } from 'react'
import { CyclesContext } from '../..'

/* Prop Drilling -> muitas propriedades apenas para comunicação entre componentes */

// interface NewCycleFormData {
//   task: string
//   minutesAmout: number
// }

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext)
  const { register } = useFormContext()

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
