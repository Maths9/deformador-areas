# Deformador de Áreas (Substituição Interativa)

Um simulador web educacional projetado para ensinar o **Teorema da Substituição em Integrais**, focando primariamente em **Leigos e Estudantes de Exatas e Humanas**. Ao invés de apresentar a Matemática como um fim em si mesmo, este projeto inverte a pedagogia tradicional: a Matemática é tratada apenas como uma ferramenta elegante para resolver **Problemas do Mundo Real**.

## 🚀 O que este Simulador faz?
O simulador permite a visualização interativa do "Jacobiano Unidimensional". Quando você troca a variável de integração de `x` para `u(x)`, o espaço "estica e encolhe". Visualizamos isso animando as fatias de Área de um gráfico para o outro, provando que a **A forma do gráfico muda brutalmente, mas a Área Total é exatamente preservada**.

### ✨ Principais Recursos Educacionais
1. **Modo História (Layman Mode):** Para não assustar o usuário, a interface inicia limpa, sem fórmulas. O aluno lê primeiro o problema real (ex: "Você tem um orçamento de Ads..."). Só depois de entender a situação ele "Invoca" as equações matemáticas para resolvê-la.
2. **Cenários do Cotidiano:** A aplicação já vem com problemas pré-montados sobre Saúde (Filtração de Remédios), Economia (Inflação de Juros), Marketing Digital (Custo de Aquisição e Saturação) e Trânsito.
3. **Diagrama Minimalista:** O "Monstro Algébrico" (aquela equação enorme) é abstraído visualmente para um fluxo simples: `[ Problema ∫ f(x)dx ] ➡️ [ Ponte u(x) ] ➡️ [ Solução Elegante ∫ g(u)du ]`.
4. **Animação Lúdica:** Os retângulos de Riemann "voam" de um gráfico para o outro, mostrando como o "diferencial de velocidade" da função deforma a largura do tempo.

## 🛠️ Tecnologias Utilizadas
- **100% Frontend (HTML, CSS, JS puros)**
- **Nenhum Servidor Necessário:** Roda imediatamente em qualquer navegador e celular.
- **Math.js:** Para Árvores de Sintaxe (AST) e Derivações Simbólicas instantâneas (derivada do Jacobiano $du$).
- **KaTeX:** Motor de renderização rápida em TeX para exibir fórmulas estéticas na tela.
- **Canvas API:** Renderização nativa otimizada a 60fps para milhares de "Retângulos de Riemann".

## 📦 Como Executar
1. O projeto não possui dependências Node.js.
2. Simplesmente abra o arquivo `index.html` em seu navegador.
3. (Opcional) Use a extensão *Live Server* do VSCode se desejar editar o código localmente.

## 📱 Responsividade (Mobile-First)
A UI foi arquitetada usando *CSS Flexbox* flexível. Em dispositivos móveis, a disposição Lado-a-Lado dos gráficos sofre um empilhamento em Coluna automático, e a seta de transição ($u(x)$) gira 90 graus apontando para baixo, garantindo que o fluxo lógico da matemática acompanhe a rolagem de tela do usuário.

## 🤝 Autor e Agradecimentos
Construído para aproximar a beleza da Matemática Avançada (Cálculo) da vida de pessoas de qualquer área (Negócios, Economia, Biologia).
