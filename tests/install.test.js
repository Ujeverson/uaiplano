// tests/install.test.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

let testDir;
let passed = 0;
let failed = 0;

function assert(condicao, mensagem) {
  if (condicao) {
    console.log(`  ✅ ${mensagem}`);
    passed++;
  } else {
    console.log(`  ❌ ${mensagem}`);
    failed++;
  }
}

function setup() {
  testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'uaiplano-test-'));
}

function teardown() {
  fs.rmSync(testDir, { recursive: true, force: true });
}

function runInstall() {
  const cli = path.join(__dirname, '..', 'bin', 'uaiplano.js');
  execSync(`node "${cli}" install`, { cwd: testDir, stdio: 'pipe' });
}

console.log('\n🧪 UAIPLANO — Testes de Instalação\n');

// ─── Teste 1: Estrutura de pastas ──────────────────────────────
console.log('Teste 1: Estrutura de pastas criada corretamente');
setup();
try {
  runInstall();
  assert(fs.existsSync(path.join(testDir, 'PUTS.md')), 'PUTS.md existe');
  assert(fs.existsSync(path.join(testDir, '.agents', 'skills')), '.agents/skills/ existe');
  assert(fs.existsSync(path.join(testDir, 'template')), 'template/ existe');
  assert(fs.existsSync(path.join(testDir, 'documentos')), 'documentos/ existe');
  assert(fs.existsSync(path.join(testDir, 'planos')), 'planos/ existe');
  assert(fs.existsSync(path.join(testDir, 'planos', '.gitkeep')), 'planos/.gitkeep existe');
} finally {
  teardown();
}

// ─── Teste 2: Skills instaladas ────────────────────────────────
console.log('\nTeste 2: Todas as skills estão presentes');
setup();
try {
  runInstall();
  const skills = [
    'uaiplano-supervisor',
    'uaiplano-extrator',
    'uaiplano-diretrizes',
    'uaiplano-redacao',
  ];
  for (const skill of skills) {
    const skillPath = path.join(testDir, '.agents', 'skills', skill, 'SKILL.md');
    assert(fs.existsSync(skillPath), `${skill}/SKILL.md existe`);
  }
} finally {
  teardown();
}

// ─── Teste 3: Template e mapa ──────────────────────────────────
console.log('\nTeste 3: Template e mapa-campos.json presentes');
setup();
try {
  runInstall();
  assert(
    fs.existsSync(path.join(testDir, 'template', 'mapa-campos.json')),
    'mapa-campos.json existe'
  );
  const mapa = JSON.parse(
    fs.readFileSync(path.join(testDir, 'template', 'mapa-campos.json'), 'utf8')
  );
  assert(mapa.versao === '1.0', 'mapa-campos.json tem versão 1.0');
  assert(mapa.pagina_1 !== undefined, 'mapa-campos.json tem pagina_1');
  assert(mapa.pagina_2 !== undefined, 'mapa-campos.json tem pagina_2');
} finally {
  teardown();
}

// ─── Teste 4: Não sobrescreve existentes ───────────────────────
console.log('\nTeste 4: Não sobrescreve arquivos existentes');
setup();
try {
  // Criar PUTS.md com conteúdo customizado
  fs.writeFileSync(path.join(testDir, 'PUTS.md'), 'CUSTOMIZADO');
  // Criar documentos/ com conteúdo
  fs.mkdirSync(path.join(testDir, 'documentos'), { recursive: true });
  fs.writeFileSync(path.join(testDir, 'documentos', 'MEU_PPC.pdf'), 'PPC');

  runInstall();

  const puts = fs.readFileSync(path.join(testDir, 'PUTS.md'), 'utf8');
  assert(puts === 'CUSTOMIZADO', 'PUTS.md existente não foi sobrescrito');

  assert(
    fs.existsSync(path.join(testDir, 'documentos', 'MEU_PPC.pdf')),
    'Arquivo existente em documentos/ foi preservado'
  );

  assert(
    fs.existsSync(path.join(testDir, 'documentos', 'LEIA-ME.md')),
    'LEIA-ME.md foi adicionado a documentos/ existente'
  );
} finally {
  teardown();
}

// ─── Teste 5: PUTS.md contém regras essenciais ─────────────────
console.log('\nTeste 5: PUTS.md contém regras essenciais');
setup();
try {
  runInstall();
  const puts = fs.readFileSync(path.join(testDir, 'PUTS.md'), 'utf8');
  assert(puts.includes('UAIPLANO'), 'Contém "UAIPLANO"');
  assert(puts.includes('português do Brasil'), 'Contém regra de idioma');
  assert(puts.includes('documentos/'), 'Referencia documentos/');
  assert(puts.includes('planos/'), 'Referencia planos/');
  assert(puts.includes('FO-178'), 'Referencia FO-178');
} finally {
  teardown();
}

// ─── Resultado ─────────────────────────────────────────────────
console.log(`\n📊 Resultado: ${passed} passou, ${failed} falhou\n`);
process.exit(failed > 0 ? 1 : 0);
