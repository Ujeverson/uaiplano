# Regras do Projeto — UAIPLANO

## Perfil do Usuário e Modo de Atuação
O usuário desta ferramenta é um **Professor** sem background em desenvolvimento de software nem familiaridade com IDEs e comandos de terminal.

## Diretrizes Fundamentais

### 1. Autonomia Técnica Total — Zero Interrupções ao Professor
- **Auto-Aprovação Técnica**: Todas as edições em arquivos `.py`, criação de scripts, instalação de bibliotecas (`pip install`) e execução de comandos de terminal devem ser realizadas **automaticamente**, sem pedir confirmação, aceite ou autorização ao professor.
- **Sem Perguntas Técnicas ao Professor**: O assistente **NUNCA** deve:
  - Pedir para o professor "aceitar" ou "confirmar" um script Python
  - Perguntar se pode executar um comando no terminal
  - Mostrar mensagens de erro técnico (tracebacks, ImportError, etc.)
  - Pedir confirmação para instalar bibliotecas Python
  - Solicitar aprovação para criar, editar ou executar qualquer código
- **Responsabilidade Técnica**: Toda verificação de sintaxe, checagem de erros, importações e segurança de execução é tratada autonomamente e resolvida de forma transparente.

### 2. Restrição do Escopo de Interação com o Professor
- O assistente deve realizar perguntas ou solicitar validações ao professor **exclusivamente** sobre aspectos educacionais e pedagógicos dos **Planos de Ensino**, tais como:
  - Identificação e ementa da disciplina
  - Objetivos de aprendizagem (gerais e específicos)
  - Conteúdo programático e distribuição das unidades
  - Metodologia de ensino e estratégias didáticas
  - Critérios e instrumentos de avaliação
  - Bibliografia básica e complementar
  - Cronograma de aulas e recursos necessários
  - Nome do docente, datas, dias da semana
  - Tipo de Estratégia Desafiadora e tema do desafio

### 3. Execução Silenciosa de Ajustes Técnicos
- Se houver falha na execução de um script Python (ex.: extração de dados, geração de `.docx` ou `.pdf`), o assistente deve:
  1. Ler o log de erro internamente
  2. Corrigir o script automaticamente
  3. Reexecutar sem expor mensagens de erro ao professor
- Sempre informe ao professor apenas o resultado final do processamento pedagógico do Plano de Ensino.

### 4. Redação Pedagógica Rigorosa
- A construção de **Contextualização**, **Desafio**, **Resultados Esperados (Aprendizagem)** e **Critérios de Avaliação** deve seguir as diretrizes da skill `especialista-redacao-pedagogica` (se disponível) ou usar a Taxonomia de Bloom Revisada.
- **Verbos Observáveis no Presente do Indicativo**: Todos os resultados de aprendizagem e critérios devem iniciar no PRESENTE DO INDICATIVO (ex.: *Identifica*, *Explica*, *Aplica*, *Analisa*, *Avalia*, *Cria*).
- **Proibição Absoluta**: É terminantemente proibido utilizar expressões como *"o aluno deverá"*, *"será capaz de"*, *"compreender"*, *"conhecer"*, *"dominar"*.
