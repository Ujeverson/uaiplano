#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const pkg = require('../package.json');
const VERSAO = pkg.version;

// ─── Cores para terminal ───────────────────────────────────────
const cor = {
  reset: '\x1b[0m',
  verde: '\x1b[32m',
  amarelo: '\x1b[33m',
  azul: '\x1b[34m',
  vermelho: '\x1b[31m',
  negrito: '\x1b[1m',
  cinza: '\x1b[90m',
};

function sucesso(msg) { console.log(`${cor.verde}  ✅ ${msg}${cor.reset}`); }
function aviso(msg) { console.log(`${cor.amarelo}  ⚠️  ${msg}${cor.reset}`); }
function erro(msg) { console.error(`${cor.vermelho}  ❌ ${msg}${cor.reset}`); }
function info(msg) { console.log(`${cor.azul}  📁 ${msg}${cor.reset}`); }
function titulo(msg) { console.log(`\n${cor.negrito}${msg}${cor.reset}`); }

// ─── Verificar versão do Node.js ───────────────────────────────
function verificarNode() {
  const versaoAtual = process.versions.node;
  const major = parseInt(versaoAtual.split('.')[0], 10);
  if (major < 18) {
    erro(`Node.js ${versaoAtual} detectado. O UAIPLANO requer Node.js >= 18.`);
    console.log(`\n  Instale a versão mais recente em: https://nodejs.org/`);
    process.exit(1);
  }
}

// ─── Copiar diretório recursivamente ───────────────────────────
function copiarRecursivo(origem, destino, opcoes = {}) {
  const criados = [];

  if (!fs.existsSync(destino)) {
    fs.mkdirSync(destino, { recursive: true });
  }

  const itens = fs.readdirSync(origem);

  for (const item of itens) {
    const caminhoOrigem = path.join(origem, item);
    const caminhoDestino = path.join(destino, item);
    const stat = fs.statSync(caminhoOrigem);

    if (stat.isDirectory()) {
      const subCriados = copiarRecursivo(caminhoOrigem, caminhoDestino, opcoes);
      criados.push(...subCriados);
    } else {
      // Se o arquivo já existe, não sobrescrever (exceto se forçado)
      if (fs.existsSync(caminhoDestino) && !opcoes.sobrescrever) {
        continue;
      }
      fs.copyFileSync(caminhoOrigem, caminhoDestino);
      criados.push(caminhoDestino);
    }
  }

  return criados;
}

// ─── Comando: install ──────────────────────────────────────────
function instalar(destino) {
  titulo(`🎓 UAIPLANO v${VERSAO} — Instalador`);
  console.log(`${cor.cinza}   Ferramenta de Planos de Ensino — SENAI/FATESG${cor.reset}\n`);

  // 1. Verificar Node.js
  verificarNode();

  // 2. Localizar scaffold
  const scaffoldDir = path.join(__dirname, '..', 'scaffold');
  if (!fs.existsSync(scaffoldDir)) {
    erro('Pasta scaffold/ não encontrada no pacote. Reinstale o UAIPLANO.');
    process.exit(1);
  }

  // 3. Copiar skills para .agents/skills/
  const skillsOrigem = path.join(scaffoldDir, 'skills');
  const skillsDestino = path.join(destino, '.agents', 'skills');
  info('Instalando agentes especializados...');
  if (fs.existsSync(skillsOrigem)) {
    copiarRecursivo(skillsOrigem, skillsDestino);
    sucesso('Agentes instalados em .agents/skills/');
  } else {
    aviso('Pasta de skills não encontrada no scaffold');
  }

  // 3b. Copiar AGENTS.md para .agents/
  const agentsOrigem = path.join(scaffoldDir, 'AGENTS.md');
  const agentsDestino = path.join(destino, '.agents', 'AGENTS.md');
  if (fs.existsSync(agentsOrigem)) {
    if (!fs.existsSync(agentsDestino)) {
      // Garantir que .agents/ existe
      const agentsDir = path.join(destino, '.agents');
      if (!fs.existsSync(agentsDir)) {
        fs.mkdirSync(agentsDir, { recursive: true });
      }
      fs.copyFileSync(agentsOrigem, agentsDestino);
      sucesso('AGENTS.md instalado em .agents/ (regras de autonomia técnica)');
    } else {
      aviso('AGENTS.md já existe em .agents/ — mantido sem alterações');
    }
  }

  // 4. Copiar template/
  const templateOrigem = path.join(scaffoldDir, 'template');
  const templateDestino = path.join(destino, 'template');
  info('Copiando template FO-178...');
  if (fs.existsSync(templateOrigem)) {
    copiarRecursivo(templateOrigem, templateDestino);
    sucesso('Template instalado em template/');
  } else {
    aviso('Pasta de template não encontrada no scaffold');
  }

  // 5. Copiar PUTS.md
  const putsOrigem = path.join(scaffoldDir, 'PUTS.md');
  const putsDestino = path.join(destino, 'PUTS.md');
  if (fs.existsSync(putsOrigem)) {
    if (!fs.existsSync(putsDestino)) {
      fs.copyFileSync(putsOrigem, putsDestino);
      sucesso('PUTS.md criado na raiz');
    } else {
      aviso('PUTS.md já existe — mantido sem alterações');
    }
  }

  // 6. Criar/verificar documentos/
  const documentosDir = path.join(destino, 'documentos');
  if (!fs.existsSync(documentosDir)) {
    fs.mkdirSync(documentosDir, { recursive: true });
    sucesso('Pasta documentos/ criada');
  } else {
    aviso('Pasta documentos/ já existe — conteúdo mantido');
  }

  // Copiar LEIA-ME.md para documentos/ (se não existir)
  const leiaOrigem = path.join(scaffoldDir, 'documentos', 'LEIA-ME.md');
  const leiaDestino = path.join(documentosDir, 'LEIA-ME.md');
  if (fs.existsSync(leiaOrigem) && !fs.existsSync(leiaDestino)) {
    fs.copyFileSync(leiaOrigem, leiaDestino);
  }

  // 7. Criar planos/
  const planosDir = path.join(destino, 'planos');
  if (!fs.existsSync(planosDir)) {
    fs.mkdirSync(planosDir, { recursive: true });
    // Criar .gitkeep
    fs.writeFileSync(path.join(planosDir, '.gitkeep'), '');
    sucesso('Pasta planos/ criada');
  } else {
    aviso('Pasta planos/ já existe — mantida');
  }

  // 8. Mensagem final
  titulo('✅ UAIPLANO instalado com sucesso!\n');
  console.log(`${cor.negrito}📁 Estrutura criada:${cor.reset}`);
  console.log('   .agents/skills/   → Agentes especializados');
  console.log('   template/         → Template oficial FO-178');
  console.log('   documentos/       → Coloque seus PPCs e planos antigos aqui');
  console.log('   planos/           → Planos gerados serão salvos aqui');
  console.log('   PUTS.md           → Manual de comportamento\n');
  console.log(`${cor.negrito}👉 Próximo passo:${cor.reset} coloque o PPC do seu curso na pasta documentos/`);
  console.log('   e abra esta pasta no seu assistente de IA (Antigravity, Cline, etc.)\n');
}

// ─── CLI Router ────────────────────────────────────────────────
const comando = process.argv[2];

switch (comando) {
  case 'install':
    instalar(process.cwd());
    break;
  case '--version':
  case '-v':
    console.log(`uaiplano v${VERSAO}`);
    break;
  case '--help':
  case '-h':
  case undefined:
    console.log(`
🎓 UAIPLANO — Ferramenta de Planos de Ensino

Uso:
  npx uaiplano install    Instala a estrutura do UAIPLANO no diretório atual
  npx uaiplano --version  Exibe a versão
  npx uaiplano --help     Exibe esta ajuda
`);
    break;
  default:
    erro(`Comando desconhecido: ${comando}`);
    console.log('Use: npx uaiplano --help');
    process.exit(1);
}
