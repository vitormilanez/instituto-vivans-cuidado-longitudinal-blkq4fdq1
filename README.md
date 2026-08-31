# Instituto Vivans — Plataforma de Cuidado Longitudinal

Protótipo web funcional, interativo e navegável de cuidado longitudinal para emagrecimento saudável e saúde do envelhecimento (longevidade), acompanhando o paciente **antes, durante e depois da consulta**.

---

## 🌿 Visão do Produto
O Instituto Vivans reduz a fragmentação entre mensagens, agenda, relatos, fotos de refeições, documentos, plano de cuidado e evolução. A experiência demonstra como a tecnologia organiza o contexto clínico para o médico e torna o acompanhamento contínuo simples e sustentável para o paciente.

---

## 🚀 Como Executar o Projeto

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev

# Executar testes
npm test

# Executar build de produção
npm run build
```

---

## 📱 Jornadas Implementadas

### 1. Área do Paciente (Mobile-First)
- **Hoje (`/paciente`)**: Saudação contextual, próxima consulta agendada, check-in matinal diário de peso/disposição com feedback imediato, resumo do plano e lembretes.
- **Plano (`/paciente/plano`)**: Ações simples com separação clara entre **Orientações Aprovadas pelo Médico** e **Sugestões do Copiloto IA** (aguardando validação); marcação de conclusão interativa.
- **Diário Alimentar (`/paciente/diario`)**: Registro fotográfico de refeições com análise visual simulada assistida por IA, aviso mandatório de limitações de fotos, 3 notas de contexto (1 a 5: Saciedade, Conforto Digestivo e Facilidade) e envio ao prontuário.
- **Evolução (`/paciente/evolucao`)**: Curva ponderal, sono do relógio, passos e o medidor visual **"Quanto falta para meu objetivo?"**.
- **Mensagens (`/paciente/mensagens`)**: Conversa simulada com o Dr. Guilherme Martins e canal assíncrono seguro.
- **Consultas & Pré-Consulta (`/paciente/consultas`, `/paciente/pre-consulta`)**: Fluxo completo em 5 etapas:
  1. Visualização da próxima consulta;
  2. Consentimento informado contextual (LGPD);
  3. Escolha de modo: **Voz conversacional** ou **Texto guiado**;
  4. Perguntas com transcrição em tempo real;
  5. Edição do relato pela própria paciente;
  6. Síntese e envio direto ao Dr. Guilherme com descarte padrão de áudio.

### 2. Área do Médico (Desktop-First)
- **Visão Geral (`/medico`)**: Coorte de 22 pacientes (17 regulares e 5 atrasados), 5 consultas do dia, **Caixa de Atenção Organizada por Exceção**, agenda em linha do tempo e ação de "Dar um cutucão nos 5" com confirmação.
- **Agenda (`/medico/agenda`)**: Visões diária e semanal, filtros por status, acesso direto à sala de teleconsulta e ao dossiê.
- **Pacientes (`/medico/pacientes`, `/medico/pacientes/:id`)**: Busca e filtros, perfil longitudinal com objetivo declarado nas palavras do paciente, histórico de check-ins, diário de fotos, linha do tempo e camada de **Evidências Médicas (PubMed, Cochrane, Conitec)**.
- **Ambiente de Teleconsulta (`/medico/consulta/:id`)**: Sala de vídeo simulada lado a lado com o Copiloto Estruturador de Notas, anotações livres do médico e construtor de plano com aprovação mandatória antes do envio ao paciente.
- **Mensagens & Relatórios (`/medico/mensagens`, `/medico/relatorios`)**: Caixa de entrada por paciente com rascunhos da IA em revisão, aprovação de relatórios quinzenais/mensais e exportação de PDF simulada.

---

## 🔒 Papel da Inteligência Artificial e LGPD

### Papel do Copiloto IA:
- **Pode:** Organizar informações, sintetizar relatos de pré-consulta, estruturar notas clínicas e sugerir perguntas para o médico.
- **Não pode:** Diagnosticar, prescrever medicamentos/dosagens, decidir condutas ou enviar orientações ao paciente sem aprovação médica expressa.
- **Rótulo obrigatório:** Todo conteúdo gerado pela IA exibe `Rascunho gerado com IA - requer validação médica`.

### Privacidade e Minimização de Dados (LGPD):
- Dados 100% fictícios.
- Consentimento informado explícito antes da coleta na pré-consulta.
- Áudio de pré-consulta descartado por padrão após a transcrição.
- Não inclusão de dados para treinamento público de inteligência artificial.

---

## ⚠️ Delimitação de Protótipo e Pendências de Produção
Este projeto é um **protótipo funcional de alta fidelidade para validação com médicos e parceiros comerciais**. 

Nesta fase:
- Integrações com Apple HealthKit, Google Meet, WhatsApp, Prontuário Eletrônico (PEP) e Farmácia são demonstrativas/simuladas.
- Autenticação real, isolamento multi-tenant de clínicas, auditoria HIPAA/LGPD em nível de banco de produção e pagamentos dependem de projeto específico e homologação antes de pilotos clínicos reais.
