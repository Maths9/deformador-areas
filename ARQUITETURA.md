# Arquitetura do Software: Deformador de Áreas

Este documento descreve a estrutura técnica e as decisões arquiteturais por trás do projeto "Deformador de Áreas".

## Visão Geral
A aplicação é uma SPA (Single Page Application) baseada inteiramente no Frontend. Ela não depende de frameworks (como React ou Angular) nem de bibliotecas de empacotamento (Webpack/Vite) para manter a acessibilidade máxima e o custo zero de manutenção.

## Camada de Dados: Motor de Cenários (Presets)
Para evitar um *Backend* ou Integração com Inteligência Artificial cara e instável, o projeto adota um padrão de "Dicionário de Presets".
Em `app.js`, existe o objeto global `PRESETS`. Cada chave deste dicionário representa uma profissão ou cenário do cotidiano.
```javascript
const PRESETS = {
  marketing: {
      badgeX: "Espaço X (Orçamento de Ads)",
      badgeU: "Espaço U (Cliques Obtidos)",
      uLabel: "Cliques Gerados u(x) =",
      // ... propriedades matemáticas e textos de história (storyHTML)
  }
}
```
A injeção dinâmica de propriedades HTML via DOM garante que a interface reflita o contexto escolhido pelo usuário instantaneamente.

## Camada de Matemática Lógica
O "cérebro" das equações reside em duas bibliotecas servidas por CDN:
1. **Math.js**: 
   - Transforma *strings* do usuário (ex: `x^2 + 0.5x`) em uma Árvore de Sintaxe Abstrata (AST).
   - Executa a diferenciação simbólica do Jacobiano instantaneamente em tempo de execução: `math.derivative(nodeU, 'x')`.
   - Gera o formato TeX base.
2. **KaTeX**:
   - Compila as strings em notação TeX e injeta SVGs/HTML otimizados no DOM. Foi escolhido sobre o MathJax por ser significativamente mais rápido em re-renderizações simultâneas em animações a 60fps.

## Camada de Visualização (Canvas)
Os gráficos são renderizados usando a API Canvas 2D HTML5.
- O método `render()` em `app.js` é um pipeline sincrono leve que limpa a tela, desenha os eixos cartesianos, plota a curva resolvida matematicamente e preenche os Retângulos de Riemann.
- **Micro-interações:** Um loop via `requestAnimationFrame` gerencia o Morphing (transição) dos retângulos do Espaço X para o Espaço U, animando `state.morphT` de 0 a 1.
- **Glassmorphism:** Todo o estilo visual `.css` baseia-se em efeitos de desfoque de fundo (`backdrop-filter: blur(20px)`).

## Padrões de Interface (UX)
1. **Inversão Pedagógica (Modo História)**: A UI deliberadamente omite as renderizações KaTeX no tempo de carregamento da página. O controle de fluxo (`btn-reveal-math`) altera a classe CSS `.hidden` da div de equações apenas quando o usuário indica prontidão.
2. **Mobile-First Flexbox**: A disposição dos painéis cartesianos (`canvas-container`) obedece um `flex-direction: column` em resoluções menores que 1024px. O ícone divisor CSS gira 90 graus por meio de uma *Media Query*, orientando a leitura top-down natural de smartphones.
