# O Deformador de Áreas: Da Geometria Complexa ao Retângulo Padrão

## 🎯 O Problema
No estudo do Cálculo Diferencial e Integral, um dos obstáculos mais comuns para os estudantes é a transição da álgebra para a intuição geométrica. Quando aprendemos o **Teorema da Substituição de Variáveis** (ou Regra da Substituição / Substituição em *u*), somos ensinados a manipular símbolos: definimos $u = g(x)$, calculamos a derivada para encontrar o diferencial $du = g'(x)dx$ e magicamente simplificamos a integral.

Embora a manipulação algébrica se torne mecânica com o tempo, a **intuição geométrica frequentemente se perde**. Os estudantes aceitam que o valor numérico final da área é o mesmo, mas falham em "enxergar" por que isso acontece, já que a curva traçada pela nova função $f(u)$ e os novos limites de integração desenham uma forma geométrica completamente diferente da original no espaço $x$.

Falta a compreensão do papel crítico do diferencial $du$: ele não é apenas uma notação, mas um **fator de esticamento geométrico** (um Jacobiano unidimensional) que compensa a deformação do espaço.

## 💡 A Solução (O que o projeto faz)
**"O Deformador de Áreas"** é uma ferramenta de simulação visual e interativa desenhada especificamente para preencher essa lacuna cognitiva. 

Construído inteiramente no navegador com tecnologias web puras (HTML5 Canvas, CSS moderno e JavaScript) e impulsionado por um motor algébrico (`math.js`), o software apresenta duas visões lado a lado:
1. **Janela A (Espaço $x$)**: Mostra o formato da função original, que muitas vezes é irregular e contraintuitiva.
2. **Janela B (Espaço $u$)**: Mostra o novo espaço transformado, onde a função geralmente foi simplificada.

### A Magia do *Morphing*
Em vez de apresentar apenas o "antes" e o "depois", o software preenche o vazio do entendimento através de uma **animação de *morphing* fluida**. Ao clicar em "Animar", os blocos (Retângulos de Riemann) que compõem a área no espaço $x$ se desprendem e viajam para o espaço $u$. 

Durante essa viagem geométrica interativa, o usuário observa que:
- A altura dos retângulos muda de acordo com a nova função.
- A **largura** dos retângulos é "esticada" ou "esmagada" de acordo com o peso da derivada ($du = u'(x) \cdot dx$). 
- Ao final, as duas áreas provam ser exatamente idênticas, compensando largura por altura.

## ✨ Principais Funcionalidades
- **Entrada Dinâmica de Funções**: O usuário não é refém de exemplos fixos. É possível digitar qualquer substituição $u(x)$ e função alvo $g(u)$. O sistema calcula as derivadas simbolicamente em tempo real.
- **Cenários Interdisciplinares (Presets)**: O simulador não se prende apenas à matemática abstrata. Através de um menu interativo, o usuário pode carregar problemas do mundo real de diversas profissões, como:
  - **Economia e Finanças**: Compreender o derretimento do poder de compra devido aos juros compostos e inflação.
  - **Marketing Digital**: Visualizar a saturação do Custo de Aquisição de Cliente e o retorno marginal decrescente.
  - **Física (Energia)**: Visualizar o cálculo de Trabalho de uma mola não-linear.
  - **Estatística (Probabilidade)**: Entender a deformação da Função Densidade de Probabilidade (PDF) na transformação de variáveis aleatórias.
  - **Engenharia e Saúde**: Modelar o consumo de combustível por quilômetro vs tempo, ou a filtração de medicamentos nos rins, provando como o Jacobiano $du$ age na vida real.
- **Renderização Matemática Impecável**: Todo o texto algébrico, desde as etiquetas dos gráficos até os painéis de texto explicativos (que mudam de acordo com o cenário escolhido), é renderizado dinamicamente com **KaTeX**, proporcionando uma tipografia clássica de livros de matemática.
- **Hover Analítico**: Passar o mouse sobre qualquer retângulo da simulação abre um "Raio-X" daquela fatia exata de área, dissecando seus valores em tempo real.
- **Interface *Light Theme* Premium**: Cores vibrantes, alta legibilidade, elementos de *glassmorphism* (vidro translúcido) e um layout espaçoso para um ambiente de aprendizado moderno e sem distrações.

## 🚀 Motivação
A principal motivação deste projeto é **democratizar e modernizar a visualização matemática**. Acredita-se que o rigor da matemática não precisa ser estático. Ao colocar a geometria do Cálculo nas mãos do usuário — permitindo-lhe controlar o número de retângulos, o tempo, os limites de integração e as próprias funções — transformamos fórmulas abstratas em objetos tangíveis.

O "Deformador de Áreas" não busca substituir o ensino clássico, mas sim servir como a ponte visual definitiva para que o estudante finalmente diga: *"Ah, agora eu enxerguei o que o $du$ está fazendo!"*
