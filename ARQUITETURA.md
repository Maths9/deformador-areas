# Documentação Técnica e Arquitetura

Este documento explica as decisões técnicas tomadas na construção do "Deformador de Áreas", as tecnologias escolhidas, e suas respectivas vantagens e desvantagens.

## 🛠️ Tecnologias Utilizadas

A aplicação foi construída visando ser leve, rápida e executável diretamente no navegador sem necessidade de servidores backend ou processos de build complexos (Node.js/Webpack). 

### 1. Vanilla Web (HTML, CSS e JS puros)
Toda a estrutura foi feita sem frameworks pesados como React ou Vue.
- **Por que foi utilizado:** Para manter o projeto 100% *self-contained* (contido em si mesmo). O usuário pode apenas dar dois cliques no `index.html` e tudo funciona.
- **Vantagens:** Nenhuma dependência local, carregamento instantâneo, facilidade extrema de hospedagem (qualquer servidor estático, como GitHub Pages, serve).
- **Desvantagens:** O gerenciamento do estado da aplicação e a manipulação do DOM (como atualizar botões e sliders) precisou ser feito manualmente via `document.getElementById`, o que torna o código mais verboso.

### 2. HTML5 Canvas (API 2D)
A engine de renderização dos gráficos de funções e animações dos retângulos de Riemann.
- **Por que foi utilizado:** A animação de *morphing* exige a interpolação em tempo real de larguras, alturas e posições $x/y$ de dezenas de retângulos a 60 quadros por segundo. Se usássemos elementos DOM padrão (como `<div>` para cada retângulo) ou até mesmo SVG, o navegador poderia sofrer com perda de performance e *layout trashing*.
- **Vantagens:** 
  - **Performance brutal**: O Canvas apenas pinta pixels na tela. Pode desenhar milhares de retângulos sem lentidão.
  - **Controle Absoluto**: Controle total sobre a função de interpolação matemática (`easeInOutCubic`) frame a frame.
- **Desvantagens:**
  - **Falta de acessibilidade**: Leitores de tela para deficientes visuais não conseguem "ler" o que está desenhado no Canvas.
  - **Complexidade de Interação**: Criar um *tooltip* (aquele balãozinho que aparece ao passar o mouse) exigiu cálculos matemáticos manuais de colisão entre o mouse e as coordenadas virtuais do gráfico.

### 3. Math.js
Biblioteca de matemática simbólica e computacional para JavaScript.
- **Por que foi utilizado:** O JavaScript nativo não sabe calcular derivadas matemáticas nem interpretar textos como `"cos(x^2)"`. Precisávamos descobrir automaticamente o fator $du = u'(x)dx$ baseado na entrada arbitrária do usuário.
- **Vantagens:** Permite criar *Árvores de Sintaxe Abstrata (AST)*. Com o `math.js`, nós transformamos um texto puro digitado pelo usuário na derivada exata, e depois juntamos tudo para gerar a função completa $f(x)$ em tempo real.
- **Desvantagens:** É uma biblioteca relativamente pesada. Se o usuário digitar algo fora da sintaxe esperada (ex: `2x` em vez de `2*x` em algumas versões antigas), o parser pode falhar, obrigando o uso de blocos `try/catch` para evitar a quebra do software.

### 4. KaTeX
Motor de renderização de fontes tipográficas matemáticas desenvolvida pela Khan Academy.
- **Por que foi utilizado:** Porque ler `(cos((x^2))) * (2 * x)` é terrível do ponto de vista didático. As fórmulas precisam parecer com o quadro-negro do professor.
- **Vantagens:** Diferente do MathJax clássico, o KaTeX é extremamente rápido. Ele converte as saídas do `math.js` (método `.toTex()`) em um layout HTML elegante quase instantaneamente.
- **Desvantagens:** Requer o download de fontes web específicas da biblioteca para renderizar os símbolos corretamente.

---

## ⚙️ A Arquitetura do Código (`app.js`)

O código segue o padrão **Global State Machine com Single Render Loop**. 

1. **Estado Único (`state` e `mathState`)**: Todas as variáveis importantes (limites de integração, velocidade, tempo de animação $t$) vivem em um objeto global central.
2. **Ciclo de Atualização (`updateMathFunctions`)**: Toda vez que o usuário digita algo, a AST é recomputada, a derivada é atualizada, e o estado é limpo.
3. **A Função `render()`**: Ela apaga totalmente as duas telas do Canvas e as redesenha do zero a cada frame, com base nas variáveis do Estado Único.
4. **Animação (`requestAnimationFrame`)**: O núcleo do morphing. A variável `morphT` viaja de $0$ a $1$ ao longo de alguns segundos. No tempo $0$, os retângulos têm a geometria exata do "Espaço $x$". No tempo $1$, eles assumem a geometria do "Espaço $u$". Em qualquer valor decimal intermediário (ex: $0.5$), a função interpola suavemente os vértices.
5. **UI Orientada a Dados (Presets Interdisciplinares)**: Os cenários de Física e Estatística não são páginas HTML novas. O sistema usa um dicionário interno (objeto `PRESETS` em Javascript) que atua como banco de dados. Quando o usuário troca o cenário no topo da tela, o JS injeta as novas equações nos inputs, reescreve os parágrafos do painel inferior (inserindo blocos HTML formatados) e invoca a biblioteca de auto-renderização do KaTeX para processar tudo instantaneamente.
