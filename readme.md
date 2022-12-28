[![](https://media0.giphy.com/media/lXTOU535oow2HtYL16/giphy.gif?cid=790b7611040feb0c675a398135a8926a3092b7670517006f&rid=giphy.gif&ct=g)](https://media0.giphy.com/media/lXTOU535oow2HtYL16/giphy.gif?cid=790b7611040feb0c675a398135a8926a3092b7670517006f&rid=giphy.gif&ct=g)

# Pomodoro  Ignite Timer
Este é um projeto que simula o funcionamento do Pomodoro Timer, uma técnica de gerenciamento de tempo que consiste em dividir o trabalho em períodos de 25 minutos, intercalados por descansos de 5 minutos.

### Tecnologias utilizadas
- [React](https://pt-br.reactjs.org/) - Biblioteca JavaScript utilizada para criar interfaces de usuário
- [styled-components](https://styled-components.com/) - Biblioteca para estilizar componentes com CSS
- [date-fns](https://date-fns.org/) - Biblioteca de funções para manipular datas
- [zod](https://github.com/vriad/zod) - Biblioteca de validação de schemas para o formulário de novo ciclo
- [react-hook-form](https://react-hook-form.com/) - Biblioteca para criação de formulários reutilizáveis no React
- [immer](https://immerjs.github.io/immer/docs/introduction) - Biblioteca para aplicar mudanças no estado de forma imutável
- [phosphor-react](https://github.com/phosphor-icons/phosphor-react) - Biblioteca de ícones

## Técnicas utilizadas
- Prop drilling: Método para passar informações de um componente pai para um componente filho, onde é necessário passar as informações através de vários componentes intermediários.
- Context API: Método para compartilhar informações entre vários componentes ao mesmo tempo, sem precisar passar as informações por vários componentes intermediários.
- useContext: Hook que permite manipular a variável de contexto, que geralmente é criada como objeto.
- Controlled components: Componentes que mantêm em tempo real a informação do input guardada no estado.
- Uncontrolled components: Componentes que buscam a informação do input somente quando precisam.
- Schema validation: Método para definir um formato e validar os dados por esse formato.
- useForm: Hook para criar formulários controlados com validação de schema.
- zod: Biblioteca para validação de dados de formulários com uma sintaxe mais clara e legível.
- hookform/resolvers/zod: Pacote para usar zod como resolvers do useForm.
- immer: Biblioteca para facilitar a atualização do estado imutável em aplicações React.

### Instalação e uso
1. Faça o download ou clone o repositório do projeto em sua máquina.
2. Acesse a pasta do projeto pelo terminal e execute o comando `npm install` para instalar todas as dependências do projeto.
3. Execute o comando `npm run dev` para iniciar o servidor de desenvolvimento.
4. Acesse a URL http://localhost:3000 em seu navegador para ver a aplicação em funcionamento.