import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect, useState } from 'react'
import { CyclesContext } from '../..'
import { CountdownContainer, Separator } from './styles'

/* Prop Drilling -> muitas propriedades apenas para comunicação entre componentes */

export function CountDown() {
  const { activeCycle, activeCycleId, markCurrentCycleAsFinished } =
    useContext(CyclesContext)
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
          markCurrentCycleAsFinished()
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
  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished])

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
