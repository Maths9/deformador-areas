/* ========================================
   DEFORMADOR DE ÁREAS — Engine Principal
   ========================================
   Visualização interativa da substituição
   de variáveis em integrais definidas.
   f(x) = 2x·cos(x²) → g(u) = cos(u)
   com u = x², du = 2x·dx
   ======================================== */

(function () {
    'use strict';

    // ──────────────────────────────────────
    // CONFIG & CONSTANTS
    // ──────────────────────────────────────
    const CONFIG = {
        colors: {
            bg: '#ffffff',
            grid: 'rgba(0,0,0,0.05)',
            axis: 'rgba(0,0,0,0.25)',
            axisLabel: 'rgba(0,0,0,0.4)',
            curveX: '#7c3aed',
            curveXGlow: 'rgba(124,58,237,0.2)',
            curveU: '#0891b2',
            curveUGlow: 'rgba(8,145,178,0.2)',
            rectXFill: 'rgba(124,58,237,0.15)',
            rectXStroke: 'rgba(124,58,237,0.5)',
            rectUFill: 'rgba(8,145,178,0.15)',
            rectUStroke: 'rgba(8,145,178,0.5)',
            duHighlight: 'rgba(219,39,119,0.3)',
            duStroke: '#db2777',
            emerald: '#059669',
            textMuted: 'rgba(0,0,0,0.5)',
        },
        padding: { top: 30, right: 30, bottom: 50, left: 60 },
        curveSamples: 300,
        animDurationMs: 2500,
    };

    // ──────────────────────────────────────
    // PRESETS (INTERDISCIPLINARITY)
    // ──────────────────────────────────────
    const PRESETS = {
        math: {
            u: "x^2",
            g: "cos(u)",
            a: 0,
            b: 1.2,
            rects: 12,
            getTheoryHTML: (ms) => `
                <div class="theory-card">
                    <h3>🔄 Preservação de Medidas</h3>
                    <p>Ao realizar a substituição \\( u = ${ms.texU} \\), o diferencial transforma-se: \\( du = \\left(${ms.texDu}\\right)dx \\).</p>
                    <p>O fator \\( ${ms.texDu} \\) atua como um <em>Jacobiano unidimensional</em> — ele "estica" a largura dos retângulos no espaço u, enquanto a altura muda proporcionalmente.</p>
                </div>
                <div class="theory-card">
                    <h3>📏 O Esticamento Geométrico</h3>
                    <p>A área de cada retângulo é preservada: <strong>\\( f(x_i)\\Delta x \\approx g(u_i)\\Delta u \\)</strong></p>
                    <p>No espaço u, a largura do retângulo sofreu uma escala equivalente à derivada da substituição.</p>
                </div>
                <div class="theory-card">
                    <h3>🎯 Resultado</h3>
                    <p>Duas figuras com <em>geometrias completamente diferentes</em>, mas com <strong>exatamente a mesma área</strong>. A substituição redistribui a "massa geométrica" sem perder nem ganhar nada.</p>
                </div>
            `
        },
        physics: {
            u: "x^2",
            g: "e^(-u)",
            a: 0,
            b: 1.5,
            rects: 15,
            getTheoryHTML: (ms) => `
                <div class="theory-card">
                    <h3>⚡ Energia Potencial Não-Linear</h3>
                    <p>Imagine uma mola cuja energia varia com \\( u = ${ms.texU} \\). A força exercida é o trabalho realizado ao longo do espaço \\( x \\). O diferencial de energia é \\( du = \\left(${ms.texDu}\\right)dx \\).</p>
                </div>
                <div class="theory-card">
                    <h3>📏 O Espaço de Energia</h3>
                    <p>No gráfico da esquerda (Espaço X), a curva mostra a força variável. A área sob a curva é o <strong>Trabalho Total</strong> (Joules).</p>
                    <p>Ao mudar para o Espaço U (Energia), a curva mostra como o sistema se comporta de forma mais simples (a força decai exponencialmente com a energia), mas a área total continua sendo exatamente a mesma energia transferida!</p>
                </div>
                <div class="theory-card">
                    <h3>🎯 Resultado</h3>
                    <p>O "fator de esticamento" \\( ${ms.texDu} \\) converteu os pequenos incrementos de distância (\\( \\Delta x \\)) em pequenos incrementos de energia potencial (\\( \\Delta u \\)). A física se preserva!</p>
                </div>
            `
        },
        stats: {
            u: "x^2",
            g: "e^(-u)",
            a: 0,
            b: 2.0,
            rects: 20,
            getTheoryHTML: (ms) => `
                <div class="theory-card">
                    <h3>🎲 Transformação de Variáveis Aleatórias</h3>
                    <p>Seja \\( X \\) uma variável aleatória. Se criarmos uma nova variável \\( U = ${ms.texU} \\), a Função Densidade de Probabilidade (PDF) precisa mudar de formato para que a probabilidade total continue sendo 100%.</p>
                </div>
                <div class="theory-card">
                    <h3>📏 Conservação da Probabilidade</h3>
                    <p>No espaço X (esquerda), a área sob a curva de Rayleigh representa a probabilidade de um evento. Se trocarmos a variável para \\( u \\), a curva se transforma em uma distribuição Exponencial. O diferencial \\( du = \\left(${ms.texDu}\\right)dx \\) nos obriga a ajustar a "altura" da distribuição para compensar a largura da base.</p>
                </div>
                <div class="theory-card">
                    <h3>🎯 Resultado</h3>
                    <p>A área total nos dois gráficos é idêntica! Isso explica geometricamente por que a transformação de densidades na Estatística exige multiplicar pelo Jacobiano: para que nenhuma probabilidade seja "criada ou destruída" por acidente!</p>
                </div>
            `
        },
        traffic: {
            u: "x^2 + 0.5*x",
            g: "2/(u+1)",
            a: 0,
            b: 2.0,
            rects: 16,
            getTheoryHTML: (ms) => `
                <div class="theory-card">
                    <h3>🚗 Consumo e Viagem (O Problema)</h3>
                    <p>Imagine que você está viajando de carro. O eixo original \\( x \\) é o <strong>Tempo de viagem (horas)</strong>. No entanto, o medidor do carro registra o consumo de combustível de acordo com a <strong>Distância Percorrida (km)</strong>, que chamaremos de \\( u = ${ms.texU} \\).</p>
                    <p>O consumo em relação à distância é de \\( g(u) = ${ms.texG} \\) Litros/km. Como calcular a gasolina total gasta pelo tempo da viagem?</p>
                </div>
                <div class="theory-card">
                    <h3>📏 Espaço de Tempo vs. Espaço de Distância</h3>
                    <p>No espaço X (gráfico da esquerda), a curva mostra o consumo do carro por <em>hora</em>. Mas o consumo real depende da Velocidade! A velocidade é exatamente a derivada da distância: \\( du = \\left(${ms.texDu}\\right)dx \\) (km/h).</p>
                    <p>No espaço U (gráfico da direita), a curva mostra o consumo nativo do carro por <em>quilômetro</em>.</p>
                </div>
                <div class="theory-card">
                    <h3>🎯 O Tanque de Gasolina</h3>
                    <p>A "área" nos dois gráficos é a mesma: é o total de <strong>Litros de Gasolina Consumidos</strong>. O diferencial \\( du \\) (a velocidade do carro) "estica" os retângulos de tempo porque quando o carro está muito rápido, ele percorre muitos quilômetros em um intervalo de tempo minúsculo!</p>
                </div>
            `
        },
        health: {
            u: "x^2",
            g: "15*e^(-u)",
            a: 0,
            b: 1.8,
            rects: 18,
            getTheoryHTML: (ms) => `
                <div class="theory-card">
                    <h3>💊 Filtração de Remédios nos Rins</h3>
                    <p>Ao tomar um medicamento, a concentração no sangue (mg/L) cai à medida que seus rins filtram o plasma. O espaço \\( u \\) é o <strong>Volume Total Filtrado (L)</strong>, dado por \\( u = ${ms.texU} \\), onde \\( x \\) é o Tempo cronológico (horas).</p>
                </div>
                <div class="theory-card">
                    <h3>🩸 A Taxa de Filtração (O Jacobiano)</h3>
                    <p>No espaço U (direita), a concentração da droga \\( g(u) = ${ms.texG} \\) cai perfeitamente, e a área sob a curva é a massa total excretada (mg).</p>
                    <p>Mas os rins não filtram em velocidade constante! A taxa de filtração (L/h) varia durante o dia, sendo dada pela derivada \\( du = \\left(${ms.texDu}\\right)dx \\).</p>
                </div>
                <div class="theory-card">
                    <h3>🎯 Dose Acumulada</h4>
                    <p>A substituição prova que a quantidade de remédio que sai do corpo (a Área) não depende apenas do relógio (tempo \\( x \\)), mas da <em>eficiência do rim</em> (o fator \\( du \\)). Um retângulo largo de tempo pode ser encolhido se o rim estiver trabalhando lentamente naquela hora!</p>
                </div>
            `
        }
    };

    // ──────────────────────────────────────
    // STATE
    // ──────────────────────────────────────
    const state = {
        numRects: 12,
        animSpeed: 1,
        intervalA: 0,
        intervalB: 1.2,
        morphT: 0,          // 0 = x-space, 1 = u-space
        isAnimating: false,
        animDirection: 1,    // 1 = forward, -1 = backward
        animStartTime: null,
        showDu: false,
        theoryCollapsed: false,
        hoverRectIndex: -1,
    };

    // ──────────────────────────────────────
    // DOM REFS
    // ──────────────────────────────────────
    const canvasX = document.getElementById('canvas-x');
    const canvasU = document.getElementById('canvas-u');
    const ctxX = canvasX.getContext('2d');
    const ctxU = canvasU.getContext('2d');
    const bgCanvas = document.getElementById('bg-particles');
    const bgCtx = bgCanvas.getContext('2d');

    const sliderRects = document.getElementById('num-rects');
    const sliderSpeed = document.getElementById('anim-speed');
    const valRects = document.getElementById('num-rects-val');
    const valSpeed = document.getElementById('anim-speed-val');
    const inputA = document.getElementById('interval-a');
    const inputB = document.getElementById('interval-b');
    const btnPlay = document.getElementById('btn-play');
    const btnPlayText = document.getElementById('btn-play-text');
    const playIcon = document.getElementById('play-icon');
    const btnReset = document.getElementById('btn-reset');
    const btnDu = document.getElementById('btn-toggle-du');
    const areaXDisplay = document.querySelector('#area-x span');
    const areaUDisplay = document.querySelector('#area-u span');
    const areaComparison = document.getElementById('area-comparison');
    const compAreaX = document.getElementById('comp-area-x');
    const compAreaU = document.getElementById('comp-area-u');
    const theoryContent = document.getElementById('theory-content');
    const toggleTheory = document.getElementById('toggle-theory');
    const morphIndicator = document.getElementById('morph-indicator');
    const presetSelect = document.getElementById('preset-select');

    // ──────────────────────────────────────
    // MATH STATE & FUNCTIONS
    // ──────────────────────────────────────
    const mathState = {
        nodeU: null,
        nodeG: null,
        nodeDu: null,
        nodeF: null,
        texU: 'x^2',
        texG: '\\cos(u)',
        texDu: '2x',
        texF: '2x \\cdot \\cos(x^2)',
        strU: 'x^2',
        strG: 'cos(u)',
        valid: false
    };

    function fX(x) {
        if (!mathState.valid) return 2 * x * Math.cos(x * x);
        try { return mathState.nodeF.evaluate({ x: x }); } catch (e) { return 0; }
    }

    function gU(u) {
        if (!mathState.valid) return Math.cos(u);
        try { return mathState.nodeG.evaluate({ u: u }); } catch (e) { return 0; }
    }

    function uOfX(x) {
        if (!mathState.valid) return x * x;
        try { return mathState.nodeU.evaluate({ x: x }); } catch (e) { return 0; }
    }

    function uPrime(x) {
        if (!mathState.valid) return 2 * x;
        try { return mathState.nodeDu.evaluate({ x: x }); } catch (e) { return 0; }
    }

    // Simpson's rule
    function integrate(fn, a, b, n) {
        n = n || 1000;
        if (a >= b) return 0;
        if (n % 2 !== 0) n++;
        const h = (b - a) / n;
        let sum = fn(a) + fn(b);
        for (let i = 1; i < n; i++) {
            sum += fn(a + i * h) * (i % 2 === 0 ? 2 : 4);
        }
        return (h / 3) * sum;
    }

    // ──────────────────────────────────────
    // CANVAS UTILITIES
    // ──────────────────────────────────────
    function setupCanvasHiDPI(canvas, ctx) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        return { w: rect.width, h: rect.height };
    }

    function mapXCoord(val, dataMin, dataMax, pxMin, pxMax) {
        return pxMin + (val - dataMin) / (dataMax - dataMin) * (pxMax - pxMin);
    }

    function mapYCoord(val, dataMin, dataMax, pxMin, pxMax) {
        return pxMax - (val - dataMin) / (dataMax - dataMin) * (pxMax - pxMin);
    }

    function niceStep(range) {
        const rawStep = range / 6;
        const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
        const norm = rawStep / mag;
        if (norm < 1.5) return mag;
        if (norm < 3.5) return 2 * mag;
        if (norm < 7.5) return 5 * mag;
        return 10 * mag;
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
    }

    // ──────────────────────────────────────
    // COMPUTE VIEW RANGES
    // ──────────────────────────────────────
    function computeViewRanges() {
        const a = state.intervalA;
        const b = state.intervalB;
        const uA = uOfX(a);
        const uB = uOfX(b);

        // X-space view
        const xPad = (b - a) * 0.25;
        const xMin = Math.min(a, 0) - xPad;
        const xMax = b + xPad;

        let yMinX = 0, yMaxX = 0;
        for (let i = 0; i <= 200; i++) {
            const x = xMin + (xMax - xMin) * i / 200;
            const y = fX(x);
            if (y < yMinX) yMinX = y;
            if (y > yMaxX) yMaxX = y;
        }
        const yPadX = (yMaxX - yMinX) * 0.2 || 0.5;
        yMinX -= yPadX;
        yMaxX += yPadX;

        // U-space view
        const uPad = (uB - uA) * 0.25;
        const uMin = Math.min(uA, 0) - uPad;
        const uMax = uB + uPad;

        let yMinU = 0, yMaxU = 0;
        for (let i = 0; i <= 200; i++) {
            const u = uMin + (uMax - uMin) * i / 200;
            const y = gU(u);
            if (y < yMinU) yMinU = y;
            if (y > yMaxU) yMaxU = y;
        }
        const yPadU = (yMaxU - yMinU) * 0.2 || 0.5;
        yMinU -= yPadU;
        yMaxU += yPadU;

        return { a, b, uA, uB, xMin, xMax, yMinX, yMaxX, uMin, uMax, yMinU, yMaxU };
    }

    // ──────────────────────────────────────
    // DRAWING: GRID & AXES
    // ──────────────────────────────────────
    function drawGrid(ctx, w, h, xMin, xMax, yMin, yMax, pad) {
        const plotL = pad.left;
        const plotR = w - pad.right;
        const plotT = pad.top;
        const plotB = h - pad.bottom;

        ctx.save();
        ctx.strokeStyle = CONFIG.colors.grid;
        ctx.lineWidth = 1;

        const xStep = niceStep(xMax - xMin);
        const yStep = niceStep(yMax - yMin);

        const xStart = Math.ceil(xMin / xStep) * xStep;
        for (let x = xStart; x <= xMax; x += xStep) {
            const px = mapXCoord(x, xMin, xMax, plotL, plotR);
            ctx.beginPath();
            ctx.moveTo(px, plotT);
            ctx.lineTo(px, plotB);
            ctx.stroke();
        }

        const yStart = Math.ceil(yMin / yStep) * yStep;
        for (let y = yStart; y <= yMax; y += yStep) {
            const py = mapYCoord(y, yMin, yMax, plotT, plotB);
            ctx.beginPath();
            ctx.moveTo(plotL, py);
            ctx.lineTo(plotR, py);
            ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = CONFIG.colors.axis;
        ctx.lineWidth = 1.5;

        if (yMin <= 0 && yMax >= 0) {
            const y0 = mapYCoord(0, yMin, yMax, plotT, plotB);
            ctx.beginPath();
            ctx.moveTo(plotL, y0);
            ctx.lineTo(plotR, y0);
            ctx.stroke();
        }

        if (xMin <= 0 && xMax >= 0) {
            const x0 = mapXCoord(0, xMin, xMax, plotL, plotR);
            ctx.beginPath();
            ctx.moveTo(x0, plotT);
            ctx.lineTo(x0, plotB);
            ctx.stroke();
        }

        // Labels
        ctx.fillStyle = CONFIG.colors.axisLabel;
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        for (let x = xStart; x <= xMax; x += xStep) {
            const px = mapXCoord(x, xMin, xMax, plotL, plotR);
            const label = Math.abs(x) < 1e-10 ? '0' : (Number.isInteger(x) ? x.toString() : x.toFixed(1));
            ctx.fillText(label, px, plotB + 6);
        }

        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        for (let y = yStart; y <= yMax; y += yStep) {
            if (Math.abs(y) < 1e-10) continue;
            const py = mapYCoord(y, yMin, yMax, plotT, plotB);
            const label = Number.isInteger(y) ? y.toString() : y.toFixed(1);
            ctx.fillText(label, plotL - 8, py);
        }

        ctx.restore();
    }

    // ──────────────────────────────────────
    // DRAWING: CURVE
    // ──────────────────────────────────────
    function drawCurve(ctx, fn, w, h, xMin, xMax, yMin, yMax, pad, color, glowColor) {
        const plotL = pad.left;
        const plotR = w - pad.right;
        const plotT = pad.top;
        const plotB = h - pad.bottom;

        const n = CONFIG.curveSamples;
        const step = (xMax - xMin) / n;

        ctx.save();
        ctx.beginPath();
        ctx.rect(plotL, plotT, plotR - plotL, plotB - plotT);
        ctx.clip();

        // Glow pass
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
            const x = xMin + i * step;
            const y = fn(x);
            const px = mapXCoord(x, xMin, xMax, plotL, plotR);
            const py = mapYCoord(y, yMin, yMax, plotT, plotB);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Main curve
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
            const x = xMin + i * step;
            const y = fn(x);
            const px = mapXCoord(x, xMin, xMax, plotL, plotR);
            const py = mapYCoord(y, yMin, yMax, plotT, plotB);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
    }

    // ──────────────────────────────────────
    // COMPUTE RIEMANN RECTANGLES
    // ──────────────────────────────────────
    function computeRectsX(a, b, n) {
        const dx = (b - a) / n;
        const rects = [];
        for (let i = 0; i < n; i++) {
            const xi = a + i * dx;
            const xMid = xi + dx / 2;
            const height = fX(xMid);
            rects.push({
                x: xi,
                width: dx,
                height: height,
                xMid: xMid,
                uLeft: uOfX(xi),
                uRight: uOfX(xi + dx),
                uHeight: gU(uOfX(xMid)),
            });
        }
        return rects;
    }

    // ──────────────────────────────────────
    // DRAWING: RECTANGLES (morphing)
    // ──────────────────────────────────────
    function drawRectangles(ctx, rects, w, h, xMin, xMax, yMin, yMax, pad, fillColor, strokeColor, morphT) {
        const plotL = pad.left;
        const plotR = w - pad.right;
        const plotT = pad.top;
        const plotB = h - pad.bottom;

        ctx.save();
        ctx.beginPath();
        ctx.rect(plotL, plotT, plotR - plotL, plotB - plotT);
        ctx.clip();

        const y0 = mapYCoord(0, yMin, yMax, plotT, plotB);

        for (let i = 0; i < rects.length; i++) {
            const r = rects[i];

            // Interpolate between x-space and u-space
            const xL = r.x;
            const xR = r.x + r.width;
            const uL = r.uLeft;
            const uR = r.uRight;

            const left = xL + morphT * (uL - xL);
            const right = xR + morphT * (uR - xR);
            const rectHeight = r.height + morphT * (r.uHeight - r.height);

            const rectLeft = mapXCoord(left, xMin, xMax, plotL, plotR);
            const rectRight = mapXCoord(right, xMin, xMax, plotL, plotR);
            const rectW = rectRight - rectLeft;
            const rectPxH = Math.abs(rectHeight) / (yMax - yMin) * (plotB - plotT);

            const rectY = rectHeight >= 0 ? y0 - rectPxH : y0;

            // Highlight hovered rect
            let fill = fillColor;
            let stroke = strokeColor;
            if (i === state.hoverRectIndex) {
                fill = fill.replace(/[\d.]+\)$/, '0.45)');
                stroke = stroke.replace(/[\d.]+\)$/, '0.9)');
            }

            ctx.fillStyle = fill;
            ctx.fillRect(rectLeft, rectY, rectW, rectPxH);
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1.2;
            ctx.strokeRect(rectLeft, rectY, rectW, rectPxH);

            // du highlight — show stretching factor annotations
            if (state.showDu && morphT < 0.1) {
                const widthU = r.uRight - r.uLeft;
                const factor = (widthU / r.width).toFixed(2);
                ctx.fillStyle = CONFIG.colors.duHighlight;
                ctx.fillRect(rectLeft, y0 + 2, rectW, 6);
                ctx.fillStyle = CONFIG.colors.duStroke;
                ctx.font = '9px "JetBrains Mono", monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                if (rectW > 25) {
                    ctx.fillText('×' + factor, rectLeft + rectW / 2, y0 + 10);
                }
            }
        }

        ctx.restore();
    }

    // ──────────────────────────────────────
    // DRAWING: AREA FILL UNDER CURVE
    // ──────────────────────────────────────
    function drawAreaFill(ctx, fn, a, b, w, h, xMin, xMax, yMin, yMax, pad, color) {
        const plotL = pad.left;
        const plotR = w - pad.right;
        const plotT = pad.top;
        const plotB = h - pad.bottom;

        const n = 200;
        const step = (b - a) / n;
        const y0 = mapYCoord(0, yMin, yMax, plotT, plotB);

        ctx.save();
        ctx.beginPath();
        ctx.rect(plotL, plotT, plotR - plotL, plotB - plotT);
        ctx.clip();

        ctx.fillStyle = color;
        ctx.globalAlpha = 0.08;
        ctx.beginPath();
        ctx.moveTo(mapXCoord(a, xMin, xMax, plotL, plotR), y0);
        for (let i = 0; i <= n; i++) {
            const x = a + i * step;
            const y = fn(x);
            ctx.lineTo(mapXCoord(x, xMin, xMax, plotL, plotR), mapYCoord(y, yMin, yMax, plotT, plotB));
        }
        ctx.lineTo(mapXCoord(b, xMin, xMax, plotL, plotR), y0);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    // ──────────────────────────────────────
    // DRAWING: INTEGRATION LIMITS
    // ──────────────────────────────────────
    function drawLimits(ctx, a, b, w, h, xMin, xMax, yMin, yMax, pad, color, labelA, labelB) {
        const plotL = pad.left;
        const plotR = w - pad.right;
        const plotT = pad.top;
        const plotB = h - pad.bottom;

        ctx.save();
        const pxA = mapXCoord(a, xMin, xMax, plotL, plotR);
        const pxB = mapXCoord(b, xMin, xMax, plotL, plotR);

        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;

        ctx.beginPath(); ctx.moveTo(pxA, plotT); ctx.lineTo(pxA, plotB); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pxB, plotT); ctx.lineTo(pxB, plotB); ctx.stroke();

        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        ctx.fillStyle = color;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(labelA, pxA, plotT - 4);
        ctx.fillText(labelB, pxB, plotT - 4);
        ctx.restore();
    }

    // ──────────────────────────────────────
    // DRAWING: HOVER TOOLTIP
    // ──────────────────────────────────────
    function drawHoverTooltip(ctx, rects, w, h, xMin, xMax, yMin, yMax, pad) {
        if (state.hoverRectIndex < 0 || state.hoverRectIndex >= rects.length) return;

        const r = rects[state.hoverRectIndex];
        const plotL = pad.left;
        const plotR = w - pad.right;
        const plotT = pad.top;

        const cx = mapXCoord(r.xMid, xMin, xMax, plotL, plotR);

        ctx.save();

        const text1 = 'x = ' + r.xMid.toFixed(3);
        const text2 = 'f(x) = ' + r.height.toFixed(4);
        const text3 = '\u0394x = ' + r.width.toFixed(4);
        const text4 = '\u0394u = ' + (r.uRight - r.uLeft).toFixed(4);
        const text5 = '\u00c1rea \u2248 ' + (r.height * r.width).toFixed(5);

        ctx.font = '10px "JetBrains Mono", monospace';
        const maxW = Math.max(
            ctx.measureText(text1).width,
            ctx.measureText(text2).width,
            ctx.measureText(text3).width,
            ctx.measureText(text4).width,
            ctx.measureText(text5).width
        ) + 16;

        const boxW = maxW;
        const boxH = 78;
        let boxX = cx - boxW / 2;
        const boxY = plotT + 10;

        if (boxX < plotL + 5) boxX = plotL + 5;
        if (boxX + boxW > plotR - 5) boxX = plotR - boxW - 5;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = CONFIG.colors.rectXStroke;
        ctx.lineWidth = 1;
        roundRect(ctx, boxX, boxY, boxW, boxH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        const lx = boxX + 8;
        let ly = boxY + 6;

        ctx.fillStyle = '#0f172a';
        ctx.fillText(text1, lx, ly); ly += 14;
        ctx.fillText(text2, lx, ly); ly += 14;
        ctx.fillStyle = CONFIG.colors.duStroke;
        ctx.fillText(text3, lx, ly); ly += 14;
        ctx.fillStyle = CONFIG.colors.curveU;
        ctx.fillText(text4, lx, ly); ly += 14;
        ctx.fillStyle = CONFIG.colors.emerald;
        ctx.fillText(text5, lx, ly);

        ctx.restore();
    }

    // ──────────────────────────────────────
    // MAIN RENDER
    // ──────────────────────────────────────
    function render() {
        const v = computeViewRanges();
        const t = state.morphT;
        const rects = computeRectsX(v.a, v.b, state.numRects);

        // Compute areas
        const areaX = integrate(fX, v.a, v.b);
        const areaU = integrate(gU, v.uA, v.uB);

        areaXDisplay.textContent = areaX.toFixed(6);
        areaUDisplay.textContent = areaU.toFixed(6);

        // ────── Canvas X (x-space) ──────
        const sizeX = setupCanvasHiDPI(canvasX, ctxX);
        const wX = sizeX.w, hX = sizeX.h;
        const pad = CONFIG.padding;

        ctxX.clearRect(0, 0, wX, hX);

        drawGrid(ctxX, wX, hX, v.xMin, v.xMax, v.yMinX, v.yMaxX, pad);
        drawAreaFill(ctxX, fX, v.a, v.b, wX, hX, v.xMin, v.xMax, v.yMinX, v.yMaxX, pad, CONFIG.colors.curveX);

        // In x-space, rects morph outward as t goes 0→1
        drawRectangles(ctxX, rects, wX, hX, v.xMin, v.xMax, v.yMinX, v.yMaxX, pad,
            CONFIG.colors.rectXFill, CONFIG.colors.rectXStroke, t);

        drawCurve(ctxX, fX, wX, hX, v.xMin, v.xMax, v.yMinX, v.yMaxX, pad,
            CONFIG.colors.curveX, CONFIG.colors.curveXGlow);

        drawLimits(ctxX, v.a, v.b, wX, hX, v.xMin, v.xMax, v.yMinX, v.yMaxX, pad,
            CONFIG.colors.curveX, 'a=' + v.a.toFixed(1), 'b=' + v.b.toFixed(1));

        // Curve label
        const lblXPos = v.a + (v.b - v.a) * 0.7;
        const lblXY = fX(lblXPos);
        ctxX.save();
        ctxX.fillStyle = CONFIG.colors.curveX;
        ctxX.font = 'bold 13px "JetBrains Mono", monospace';
        ctxX.textAlign = 'left';
        ctxX.textBaseline = 'bottom';
        ctxX.fillText('f(x)',
            mapXCoord(lblXPos, v.xMin, v.xMax, pad.left, wX - pad.right) + 6,
            mapYCoord(lblXY, v.yMinX, v.yMaxX, pad.top, hX - pad.bottom) - 8);
        ctxX.restore();

        // Tooltip
        if (state.hoverRectIndex >= 0 && !state.isAnimating) {
            drawHoverTooltip(ctxX, rects, wX, hX, v.xMin, v.xMax, v.yMinX, v.yMaxX, pad);
        }

        // ────── Canvas U (u-space) ──────
        const sizeU = setupCanvasHiDPI(canvasU, ctxU);
        const wU = sizeU.w, hU = sizeU.h;

        ctxU.clearRect(0, 0, wU, hU);

        drawGrid(ctxU, wU, hU, v.uMin, v.uMax, v.yMinU, v.yMaxU, pad);
        drawAreaFill(ctxU, gU, v.uA, v.uB, wU, hU, v.uMin, v.uMax, v.yMinU, v.yMaxU, pad, CONFIG.colors.curveU);

        // In u-space, rects morph inward — we use the same approach
        drawRectangles(ctxU, rects, wU, hU, v.uMin, v.uMax, v.yMinU, v.yMaxU, pad,
            CONFIG.colors.rectUFill, CONFIG.colors.rectUStroke, t);

        drawCurve(ctxU, gU, wU, hU, v.uMin, v.uMax, v.yMinU, v.yMaxU, pad,
            CONFIG.colors.curveU, CONFIG.colors.curveUGlow);

        drawLimits(ctxU, v.uA, v.uB, wU, hU, v.uMin, v.uMax, v.yMinU, v.yMaxU, pad,
            CONFIG.colors.curveU, 'u(a)=' + v.uA.toFixed(2), 'u(b)=' + v.uB.toFixed(2));

        // Curve label
        const lblUPos = v.uA + (v.uB - v.uA) * 0.3;
        const lblUY = gU(lblUPos);
        ctxU.save();
        ctxU.fillStyle = CONFIG.colors.curveU;
        ctxU.font = 'bold 13px "JetBrains Mono", monospace';
        ctxU.textAlign = 'left';
        ctxU.textBaseline = 'bottom';
        ctxU.fillText('g(u)',
            mapXCoord(lblUPos, v.uMin, v.uMax, pad.left, wU - pad.right) + 6,
            mapYCoord(lblUY, v.yMinU, v.yMaxU, pad.top, hU - pad.bottom) - 8);
        ctxU.restore();

        // ────── Area Comparison pop-up ──────
        if (t > 0.95) {
            compAreaX.textContent = areaX.toFixed(6);
            compAreaU.textContent = areaU.toFixed(6);
            areaComparison.classList.remove('hidden');
            areaComparison.classList.add('visible');
        }
    }

    // ──────────────────────────────────────
    // ANIMATION LOOP
    // ──────────────────────────────────────
    let animFrameId = null;

    function animate(timestamp) {
        if (!state.animStartTime) state.animStartTime = timestamp;

        const elapsed = (timestamp - state.animStartTime) * state.animSpeed;
        const duration = CONFIG.animDurationMs;

        let rawT = Math.min(elapsed / duration, 1);

        // easeInOutCubic
        let eased;
        if (rawT < 0.5) {
            eased = 4 * rawT * rawT * rawT;
        } else {
            eased = 1 - Math.pow(-2 * rawT + 2, 3) / 2;
        }

        if (state.animDirection === 1) {
            state.morphT = eased;
        } else {
            state.morphT = 1 - eased;
        }

        render();

        if (morphIndicator) {
            morphIndicator.style.transform = 'rotate(' + (state.morphT * 180) + 'deg)';
        }

        if (rawT < 1) {
            animFrameId = requestAnimationFrame(animate);
        } else {
            state.isAnimating = false;
            state.animStartTime = null;
            updatePlayButton();

            // Auto-reverse after forward animation
            if (state.animDirection === 1) {
                setTimeout(function () {
                    if (!state.isAnimating) {
                        state.animDirection = -1;
                        startAnimation();
                    }
                }, 1500);
            }
        }
    }

    function startAnimation() {
        if (state.isAnimating) return;
        state.isAnimating = true;
        state.animStartTime = null;
        updatePlayButton();
        animFrameId = requestAnimationFrame(animate);
    }

    function stopAnimation() {
        state.isAnimating = false;
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
        state.animStartTime = null;
        updatePlayButton();
    }

    function resetAnimation() {
        stopAnimation();
        state.morphT = 0;
        state.animDirection = 1;
        areaComparison.classList.remove('visible');
        areaComparison.classList.add('hidden');
        render();
    }

    function updatePlayButton() {
        if (state.isAnimating) {
            playIcon.setAttribute('d', 'M5 4 L5 16 M11 4 L11 16');
            btnPlayText.textContent = 'Pausar';
        } else {
            playIcon.setAttribute('d', 'M6 4 L16 10 L6 16 Z');
            btnPlayText.textContent = 'Animar';
        }
    }

    // ──────────────────────────────────────
    // BACKGROUND PARTICLES
    // ──────────────────────────────────────
    const particles = [];
    const PARTICLE_COUNT = 50;

    function initParticles() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        bgCanvas.width = w;
        bgCanvas.height = h;

        particles.length = 0;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.3 + 0.1,
            });
        }
    }

    function drawParticles() {
        const w = bgCanvas.width;
        const h = bgCanvas.height;
        bgCtx.clearRect(0, 0, w, h);

        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            bgCtx.beginPath();
            bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            bgCtx.fillStyle = 'rgba(124, 58, 237, ' + p.alpha + ')';
            bgCtx.fill();
        }

        // Connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    bgCtx.beginPath();
                    bgCtx.moveTo(particles[i].x, particles[i].y);
                    bgCtx.lineTo(particles[j].x, particles[j].y);
                    bgCtx.strokeStyle = 'rgba(124, 58, 237, ' + (0.08 * (1 - dist / 150)) + ')';
                    bgCtx.lineWidth = 0.5;
                    bgCtx.stroke();
                }
            }
        }

        requestAnimationFrame(drawParticles);
    }

    // ──────────────────────────────────────
    // KATEX MATH RENDERING
    // ──────────────────────────────────────
    function renderMath() {
        const mathX = document.getElementById('math-x');
        const mathU = document.getElementById('math-u');
        const a = state.intervalA;
        const b = state.intervalB;
        const uA = uOfX(a);
        const uB = uOfX(b);

        if (!window.katex) return;

        try {
            katex.render(
                '\\int_{' + a.toFixed(1) + '}^{' + b.toFixed(1) + '} ' + mathState.texF + '\\,dx',
                mathX,
                { throwOnError: false, displayMode: false }
            );
            katex.render(
                '\\int_{' + uA.toFixed(2) + '}^{' + uB.toFixed(2) + '} ' + mathState.texG + '\\,du',
                mathU,
                { throwOnError: false, displayMode: false }
            );

            document.getElementById('arrow-label-u').textContent = 'u = ' + mathState.strU;
            
            katex.render('f(x) \\approx ' + mathState.texF, document.getElementById('label-fx'), { throwOnError: false, displayMode: false });
            katex.render('g(u) = ' + mathState.texG, document.getElementById('label-gu'), { throwOnError: false, displayMode: false });

        } catch (e) {
            console.warn("KaTeX error:", e);
        }
    }

    function updateMathFunctions() {
        const inputU = document.getElementById('input-u');
        const inputG = document.getElementById('input-g');
        const strU = inputU ? inputU.value : 'x^2';
        const strG = inputG ? inputG.value : 'cos(u)';

        try {
            const nodeU = math.parse(strU);
            const nodeG = math.parse(strG);
            
            const nodeDu = math.derivative(nodeU, 'x');
            
            // Build AST for f(x) = g(u(x)) * u'(x)
            // Replacing 'u' with '(u(x))' but keeping it cleaner
            const cleanU = `(${strU})`;
            const strF = `${strG.replace(/\bu\b/g, cleanU)} * (${nodeDu.toString()})`;
            const nodeF = math.parse(strF);
            
            mathState.nodeU = nodeU;
            mathState.nodeG = nodeG;
            mathState.nodeDu = nodeDu;
            mathState.nodeF = nodeF;
            
            // Customize toTex to reduce parentheses
            const texOpts = { parenthesis: 'auto', implicit: 'hide' };
            mathState.texU = nodeU.toTex(texOpts);
            mathState.texG = nodeG.toTex(texOpts);
            mathState.texDu = nodeDu.toTex(texOpts);
            
            // To make f(x) look prettier, we can build its TeX manually combining g(u) and du
            // So instead of a massive tree that math.js clutters, we inject u(x) into g(u)'s TeX
            let customTexF = mathState.texG.replace(/u/g, `\\left(${mathState.texU}\\right)`);
            customTexF += ` \\cdot \\left(${mathState.texDu}\\right)`;
            mathState.texF = customTexF;
            
            mathState.strU = strU;
            mathState.strG = strG;
            mathState.valid = true;

            const preset = PRESETS[currentPresetId] || PRESETS['math'];
            theoryContent.innerHTML = preset.getTheoryHTML(mathState);
            
            if (window.renderMathInElement) {
                renderMathInElement(theoryContent, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '\\(', right: '\\)', display: false}
                    ],
                    throwOnError: false
                });
            }

            renderMath();
            resetAnimation();
        } catch (e) {
            alert('Erro ao interpretar a expressão. Verifique se a sintaxe está correta (ex: x^2, cos(u), 2*x).');
            console.error(e);
        }
    }

    // ──────────────────────────────────────
    // EVENT HANDLERS
    // ──────────────────────────────────────
    const btnApplyMath = document.getElementById('btn-apply-math');
    if (btnApplyMath) {
        btnApplyMath.addEventListener('click', updateMathFunctions);
    }
    sliderRects.addEventListener('input', function () {
        state.numRects = parseInt(sliderRects.value);
        valRects.textContent = state.numRects;
        if (!state.isAnimating) render();
    });

    sliderSpeed.addEventListener('input', function () {
        state.animSpeed = parseFloat(sliderSpeed.value);
        valSpeed.textContent = state.animSpeed.toFixed(1) + '\u00d7';
    });

    inputA.addEventListener('change', function () {
        state.intervalA = parseFloat(inputA.value) || 0;
        if (state.intervalA >= state.intervalB) {
            state.intervalA = state.intervalB - 0.1;
            inputA.value = state.intervalA.toFixed(1);
        }
        renderMath();
        resetAnimation();
    });

    inputB.addEventListener('change', function () {
        state.intervalB = parseFloat(inputB.value) || 1;
        if (state.intervalB <= state.intervalA) {
            state.intervalB = state.intervalA + 0.1;
            inputB.value = state.intervalB.toFixed(1);
        }
        renderMath();
        resetAnimation();
    });

    btnPlay.addEventListener('click', function () {
        if (state.isAnimating) {
            stopAnimation();
        } else {
            if (state.morphT >= 1) {
                state.animDirection = -1;
            } else if (state.morphT <= 0) {
                state.animDirection = 1;
            }
            startAnimation();
        }
    });

    btnReset.addEventListener('click', function () {
        resetAnimation();
    });

    btnDu.addEventListener('click', function () {
        state.showDu = !state.showDu;
        btnDu.classList.toggle('active', state.showDu);
        if (!state.isAnimating) render();
    });

    toggleTheory.addEventListener('click', function () {
        state.theoryCollapsed = !state.theoryCollapsed;
        theoryContent.classList.toggle('collapsed', state.theoryCollapsed);
        toggleTheory.style.transform = state.theoryCollapsed ? 'rotate(180deg)' : '';
    });

    document.querySelector('.theory-header').addEventListener('click', function (e) {
        if (e.target === toggleTheory || toggleTheory.contains(e.target)) return;
        toggleTheory.click();
    });

    // Resize
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            initParticles();
            if (!state.isAnimating) render();
        }, 150);
    });

    // ──────────────────────────────────────
    // HOVER: Canvas X mousemove
    // ──────────────────────────────────────
    canvasX.addEventListener('mousemove', function (e) {
        if (state.isAnimating) return;
        const rect = canvasX.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const w = rect.width;
        const padL = CONFIG.padding.left;
        const padR = CONFIG.padding.right;

        const v = computeViewRanges();
        const dataX = v.xMin + (mouseX - padL) / (w - padL - padR) * (v.xMax - v.xMin);

        const dx = (v.b - v.a) / state.numRects;
        const idx = Math.floor((dataX - v.a) / dx);

        if (idx >= 0 && idx < state.numRects) {
            if (state.hoverRectIndex !== idx) {
                state.hoverRectIndex = idx;
                render();
            }
        } else if (state.hoverRectIndex !== -1) {
            state.hoverRectIndex = -1;
            render();
        }
    });

    canvasX.addEventListener('mouseleave', function () {
        if (state.hoverRectIndex !== -1) {
            state.hoverRectIndex = -1;
            if (!state.isAnimating) render();
        }
    });

    let currentPresetId = 'math';

    function loadPreset(presetId) {
        const preset = PRESETS[presetId];
        if (!preset) return;
        currentPresetId = presetId;
        
        document.getElementById('input-u').value = preset.u;
        document.getElementById('input-g').value = preset.g;
        inputA.value = preset.a;
        inputB.value = preset.b;
        sliderRects.value = preset.rects;
        valRects.textContent = preset.rects;
        state.numRects = preset.rects;
        state.intervalA = preset.a;
        state.intervalB = preset.b;
        
        updateMathFunctions();
    }

    if (presetSelect) {
        presetSelect.addEventListener('change', (e) => {
            loadPreset(e.target.value);
        });
    }

    // ──────────────────────────────────────
    // INIT
    // ──────────────────────────────────────
    function init() {
        // Wait for KaTeX and Math.js
        var libsTimer = setInterval(function () {
            if (window.katex && window.math) {
                clearInterval(libsTimer);
                updateMathFunctions();
            }
        }, 100);

        setTimeout(function () {
            clearInterval(libsTimer);
            if (window.math) updateMathFunctions();
            else renderMath();
        }, 3000);

        initParticles();
        drawParticles();
        render();
    }

    init();

})();
