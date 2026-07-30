# 🎓 UAIPLANO — Planos de Ensino Inteligentes

Ferramenta que transforma seu assistente de IA em um especialista
na criação de planos de ensino para o padrão **FO-178 do SENAI/FATESG**.

## Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior
- IDE com assistente de IA que suporte skills
  (Antigravity, Cline, Cursor, etc.)

## Instalação

Abra o terminal na pasta onde deseja criar seus planos de ensino e execute:

```bash
npx uaiplano install
```

## Após a instalação

1. Coloque o **PPC do seu curso** (PDF) na pasta `documentos/`
   - O nome do arquivo deve começar com "PPC"
2. Coloque o **calendário acadêmico** (PDF) na pasta `documentos/`
   - O nome do arquivo deve conter "Calendário"
3. *(Opcional)* Coloque **planos de ensino antigos** na pasta `documentos/`
4. Abra a pasta no seu assistente de IA
5. O assistente irá reconhecer o UAIPLANO e guiar você automaticamente! 🚀

## Estrutura criada

```
sua-pasta/
├── PUTS.md              ← Manual de comportamento do assistente
├── .agents/skills/      ← 4 agentes especializados
├── template/            ← Template FO-178 e mapa de campos
├── documentos/          ← Seus PPCs e planos antigos
└── planos/              ← Planos gerados aqui
```

## Como funciona

O UAIPLANO usa 4 agentes especializados que trabalham em conjunto:

| Agente | Função |
|---|---|
| 👔 **Supervisor** | Orquestra o processo e revisa a qualidade |
| 🔍 **Extrator** | Lê planos de ensino antigos |
| 📚 **Diretrizes** | Consulta o PPC (RAG) |
| ✍️ **Redação** | Cria o conteúdo pedagógico |

## Fluxo de uso

```
Você informa a disciplina
    ↓
🔍 Extrator busca plano antigo
📚 Diretrizes consulta o PPC
    ↓
Você responde perguntas (nome, datas, estratégia)
    ↓
✍️ Redação cria o plano completo
    ↓
👔 Supervisor revisa e gera o .docx
    ↓
📄 Plano salvo em planos/
```

## Convenções de arquivos

| Tipo | Regra de nome | Formato |
|---|---|---|
| PPC | Inicia com `PPC` | .pdf |
| Plano antigo | Inicia com `PROF.` | .docx ou .pdf |
| Calendário | Contém `Calendário` | .pdf |

## Saída

Os planos gerados são salvos em `planos/` com o formato:

```
PROF.[NOME]_Plano_de_ensino_[DISCIPLINA]_[ANO_PERÍODO].docx
```

## Licença

MIT
