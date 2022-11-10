import { differenceInSeconds } from 'date-fns'
import { useEffect, useState } from 'react'
import { CountdownContainer, Separator } from './styles'

/* Prop Drilling -> muitas propriedades apenas para comunicação entre componentes */

interface CountdownProps {
  activeCycle: any
  setCycles: any
  activeCycleId: any
}

export function CountDown({
  activeCycle,
  setCycles,
  activeCycleId,
}: CountdownProps) {
  // armazena os segundos que passaram desde que foi criado o ciclo
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const totalSeconds = activeCycle ? activeCycle.minutesAmout * 60 : 0

  // monitora o ciclo ativo para ativar o timer quando clicado no button
  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        // usar sempre data nova no primeiro parametro
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )
        // se houver diferença é atualizado e salvo a data que foi finalizado
        if (secondsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )
          // para zerar os segundos quando finalizar o timer
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    // serve para resetar o que estava sendo feito no useEffect anteriormente
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
