# PRD — Módulo 2: Gestão de Orçamentos (Quote Service)

## Visão Geral

O **Orça Fácil** é um micro SaaS voltado a prestadores de serviço autônomos (encanadores, eletricistas, designers freelances etc.) que precisam criar e gerenciar orçamentos de forma rápida e profissional.

Este PRD cobre o **Módulo 2: Gestão de Orçamentos** — a funcionalidade central do produto. Após a autenticação (Módulo 1), o prestador precisa criar, editar, listar, duplicar e enviar orçamentos completos para seus clientes. Cada orçamento contém itens de serviço (mão de obra), itens de materiais (produtos com quantidade e preço unitário), descontos, dados do cliente e um total calculado automaticamente. O sistema deve gerar PDF para download/impressão e criar um link público para compartilhamento com o cliente final.

Este módulo é o **coração do valor proposto pelo Orça Fácil**: transformar dados brutos de um orçamento em um documento profissional, consistente e rastreável em menos de 5 minutos.

## Objetivos

- **CRUD completo de orçamentos**: criar, visualizar, editar, listar e excluir orçamentos com dados persistidos no Supabase
- **Cálculos automáticos corretos**: subtotais por seção (serviços, materiais), descontos percentuais ou fixos, e total final calculados em tempo real
- **Versionamento de orçamentos**: duplicar orçamentos existentes e manter histórico de versões (v1, v2, etc.) para rastreabilidade
- **Geração de PDF**: exportar orçamento como PDF formatado para download e impressão
- **Link compartilhável**: gerar URL pública para que o cliente final visualize o orçamento sem necessidade de login
- **CRM básico de clientes**: entidade separada de clientes vinculada aos orçamentos
- **Métrica de sucesso**: prestador consegue criar um orçamento completo e enviar em menos de 5 minutos
- **Isolamento de dados**: cada usuário vê apenas seus próprios orçamentos e clientes (Row Level Security)

## Histórias de Usuário

1. **Como prestador de serviço**, eu quero criar um novo orçamento selecionando ou cadastrando um cliente para que eu possa enviar uma proposta profissional sem precisar montar manualmente no Word ou Excel.
2. **Como prestador de serviço**, eu quero adicionar itens de serviço (descrição, quantidade, valor unitário) ao orçamento para que o cliente veja detalhadamente o que está sendo cobrado pela mão de obra.
3. **Como prestador de serviço**, eu quero adicionar itens de materiais (descrição, quantidade, valor unitário) ao orçamento para que o custo dos produtos utilizados fique transparente.
4. **Como prestador de serviço**, eu quero aplicar descontos percentuais ou de valor fixo ao orçamento para que eu possa negociar condições especiais com o cliente.
5. **Como prestador de serviço**, eu quero ver o total do orçamento calculado automaticamente em tempo real para que eu saiba o valor final antes de enviar ao cliente.
6. **Como prestador de serviço**, eu quero gerar um PDF do orçamento para que eu possa enviar por WhatsApp, e-mail ou imprimir.
7. **Como prestador de serviço**, eu quero gerar um link público do orçamento para que meu cliente possa visualizar os detalhes diretamente no navegador sem precisar de login.
8. **Como prestador de serviço**, eu quero duplicar um orçamento existente para que eu possa reutilizar a estrutura em projetos similares sem recomeçar do zero.
9. **Como prestador de serviço**, eu quero visualizar a lista de todos os meus orçamentos com status, data e valor total para que eu possa gerenciar minhas propostas de forma organizada.
10. **Como prestador de serviço**, eu quero editar um orçamento já criado para que eu possa ajustar valores, adicionar ou remover itens conforme a negociação evolui.
11. **Como prestador de serviço**, eu quero definir um status para o orçamento (Rascunho, Enviado, Aprovado, Recusado, Expirado) para que eu possa acompanhar o funil de vendas.
12. **Como prestador de serviço**, eu quero cadastrar e gerenciar meus clientes em uma lista separada para que eu possa reutilizar dados de contato em futuros orçamentos.
13. **Como prestador de serviço**, eu quero definir uma data de validade para o orçamento para que o cliente saiba até quando os valores são válidos.
14. **Como cliente final** (via link público), eu quero visualizar o orçamento que recebi em um formato limpo e profissional para que eu possa avaliar a proposta e decidir.

## Funcionalidades Principais

### 1. CRUD de Clientes

**O que faz:** Permite criar, listar, editar e excluir clientes que serão vinculados aos orçamentos.

**Por que é importante:** Centraliza os dados de contato dos clientes, evitando redigitação e garantindo consistência nos orçamentos.

**Requisitos funcionais:**

- RF01: O usuário deve poder criar um cliente com nome, e-mail, telefone e nome da empresa (opcional)
- RF02: O usuário deve poder listar todos os seus clientes em uma tabela paginada
- RF03: O usuário deve poder editar os dados de um cliente existente
- RF04: O usuário deve poder excluir um cliente (com confirmação e verificação de vínculos com orçamentos)
- RF05: Cada cliente deve ser vinculado exclusivamente ao usuário que o criou (isolamento via RLS)
- RF06: O nome do cliente e e-mail devem ser campos obrigatórios

### 2. Criação e Edição de Orçamentos

**O que faz:** Formulário multi-seção para criar ou editar um orçamento completo com serviços, materiais, descontos e dados do cliente.

**Por que é importante:** É a funcionalidade central do produto — onde o prestador monta a proposta para o cliente.

**Requisitos funcionais:**

- RF07: O usuário deve poder criar um novo orçamento vinculando-o a um cliente existente (seleção de lista)
- RF08: O usuário deve poder adicionar itens de serviço ao orçamento com: descrição (texto livre), quantidade (numérico), valor unitário (monetário)
- RF09: O usuário deve poder adicionar itens de materiais ao orçamento com: descrição (texto livre), quantidade (numérico), valor unitário (monetário)
- RF10: O usuário deve poder remover itens individuais de serviço ou materiais do orçamento
- RF11: O subtotal de serviços deve ser calculado automaticamente (soma de quantidade × valor unitário de cada item de serviço)
- RF12: O subtotal de materiais deve ser calculado automaticamente (soma de quantidade × valor unitário de cada item de material)
- RF13: O usuário deve poder aplicar um desconto ao total do orçamento, sendo ele percentual (%) ou valor fixo (R$)
- RF14: O total geral deve ser calculado automaticamente: (subtotal serviços + subtotal materiais) - desconto
- RF15: O usuário deve poder definir uma data de validade para o orçamento
- RF16: O usuário deve poder adicionar observações/notes ao orçamento (campo de texto livre, opcional)
- RF17: O título do orçamento deve ser editável e servir como identificação principal
- RF18: O orçamento deve ter um número identificador único e sequencial (ex: ORC-0001, ORC-0002)
- RF19: O status inicial do orçamento ao ser criado deve ser "Rascunho"

### 3. Listagem e Visualização de Orçamentos

**O que faz:** Tabela/lista de todos os orçamentos do usuário com filtros, ordenação e indicadores visuais de status.

**Por que é importante:** Permite ao prestador gerenciar todas as suas propostas de forma organizada e encontrar orçamentos rapidamente.

**Requisitos funcionais:**

- RF20: O usuário deve poder visualizar todos os seus orçamentos em uma tabela paginada
- RF21: A tabela deve exibir: número do orçamento, título, nome do cliente, data de criação, valor total, status e data de validade
- RF22: O usuário deve poder filtrar orçamentos por status (Rascunho, Enviado, Aprovado, Recusado, Expirado)
- RF23: O usuário deve poder ordenar a lista por data de criação, valor total ou nome do cliente
- RF24: O usuário deve poder buscar orçamentos por título ou nome do cliente
- RF25: O usuário deve poder acessar ações rápidas a partir da lista: editar, duplicar, excluir, gerar PDF, copiar link
- RF26: Cada orçamento deve ser vinculado exclusivamente ao usuário que o criou (isolamento via RLS)

### 4. Versionamento e Duplicação de Orçamentos

**O que faz:** Permite duplicar um orçamento existente e manter histórico de versões para rastreabilidade.

**Por que é importante:** Economiza tempo ao reutilizar estruturas similares e permite rastrear alterações ao longo da negociação.

**Requisitos funcionais:**

- RF27: O usuário deve poder duplicar um orçamento existente, copiando todos os seus dados (cliente, itens de serviço, itens de materiais, descontos, observações)
- RF28: O orçamento duplicado deve receber um novo número identificador e status "Rascunho"
- RF29: O sistema deve manter um histórico de versões quando um orçamento é significativamente alterado (versão numérica: v1, v2, v3)
- RF30: O usuário deve poder visualizar e restaurar uma versão anterior do orçamento

### 5. Geração de PDF

**O que faz:** Exporta o orçamento como um documento PDF formatado profissionalmente.

**Por que é importante:** Permite ao prestador enviar o orçamento por WhatsApp, e-mail ou imprimir — canais essenciais para prestadores autônomos.

**Requisitos funcionais:**

- RF31: O sistema deve gerar um PDF do orçamento com layout profissional
- RF32: O PDF deve conter: logo/nome do Orça Fácil, dados do prestador (usuário logado), dados do cliente, itens de serviço detalhados, itens de materiais detalhados, subtotais, desconto aplicado e total geral
- RF33: O PDF deve exibir o número do orçamento, data de criação e data de validade
- RF34: O PDF deve ser disponível para download imediato após geração
- RF35: O PDF deve ser otimizado para impressão (cores sóbrias, boa legibilidade em preto e branco)

### 6. Link Público de Compartilhamento

**O que faz:** Gera uma URL única e pública para que o cliente final visualize o orçamento no navegador.

**Por que é importante:** Oferece uma experiência profissional ao cliente final, que pode revisar o orçamento em qualquer dispositivo sem instalar nada.

**Requisitos funcionais:**

- RF36: O sistema deve gerar uma URL única e pública para cada orçamento
- RF37: A página pública deve exibir o orçamento de forma visualmente limpa e profissional (sem elementos de edição ou navegação do sistema)
- RF38: A página pública deve mostrar: dados do prestador, dados do cliente, itens de serviço, itens de materiais, subtotais, desconto, total e observações
- RF39: A página pública não deve requerer autenticação
- RF40: O link deve ser copiável para a área de transferência com um clique
- RF41: O prestador deve poder revogar/desativar o link público de um orçamento

### 7. Gestão de Status do Orçamento

**O que faz:** Permite definir e alterar o status de um orçamento ao longo do ciclo de vendas.

**Por que é importante:** Rastreia o progresso de cada proposta no funil de vendas e permite relatórios futuros de conversão.

**Requisitos funcionais:**

- RF42: Os status disponíveis devem ser: Rascunho, Enviado, Aprovado, Recusado, Expirado
- RF43: O status inicial deve ser "Rascunho"
- RF44: O usuário deve poder alterar o status manualmente a qualquer momento
- RF45: Orçamentos com data de validade vencida devem ser marcados automaticamente como "Expirado"
- RF46: O status deve ser exibido visualmente na lista com indicadores de cor (badges coloridos)

## Experiência do Usuário

### Personas

- **Lucas, 32 anos** — Eletricista autônomo. Usa celular e notebook básico. Cria 3-5 orçamentos por semana. Precisa de uma interface simples, com poucos cliques, que funcione bem em telas pequenas. Não é usuário avançado de tecnologia.
- **Camila, 28 anos** — Designer freelance. Cria 10-15 orçamentos por mês. Valoriza a aparência visual do orçamento gerado. Usa principalmente notebook.

### Fluxo Principal: Criar e Enviar um Orçamento

1. Usuário acessa o dashboard e clica em "Novo Orçamento"
2. Preenche o título e seleciona um cliente existente (ou cria um novo)
3. Adiciona itens de serviço (descrição, quantidade, valor unitário)
4. Adiciona itens de materiais (descrição, quantidade, valor unitário)
5. Opcionalmente aplica um desconto
6. Define data de validade e observações
7. Visualiza o total calculado em tempo real
8. Salva o orçamento (status: Rascunho → Enviado)
9. Gera PDF ou copia o link público para enviar ao cliente

### Considerações de UI/UX

- Interface limpa e focada na tarefa — minimizar distrações durante a criação do orçamento
- Cálculos em tempo real visíveis durante todo o fluxo de criação
- Indicadores visuais claros para subtotais e total (destaque no valor final)
- Formulário responsivo — funcional em celular e desktop
- Uso de tabelas editáveis inline para adicionar/remover itens de serviço e materiais
- Feedback visual imediato para ações (salvar, duplicar, excluir)
- Badges coloridos para status dos orçamentos na listagem
- O link público deve ter um design limpo, profissional e com a marca do Orça Fácil

### Requisitos de Acessibilidade

- Labels em todos os campos de formulário
- Navegação por teclado funcional em toda a interface de criação de orçamento
- Contraste mínimo WCAG AA (4.5:1 para texto normal)
- Mensagens de erro acessíveis via `aria-live`
- O PDF gerado deve ser legível por leitores de tela (texto real, não imagem)
- O link público deve ser acessível e responsivo

## Restrições Técnicas de Alto Nível

- **Backend:** Supabase BaaS — todas as tabelas (clientes, orcamentos, orcamento_servicos, orcamento_materiais) devem usar Row Level Security (RLS) para isolar dados por usuário autenticado
- **Frontend:** Nuxt 3 (SPA/SSR), Vue 3 com Composition API (`<script setup lang="ts">`)
- **Banco de dados:** PostgreSQL (via Supabase) com chaves estrangeiras adequadas entre clientes, orçamentos e itens
- **Geração de PDF:** deve ser feita no frontend ou via Nuxt server routes — sem depender de serviços externos pagos
- **Performance:** criação de orçamento deve ser fluida — cálculos em tempo real não devem causar lag perceptível
- **Segurança:** links públicos de orçamento não devem expor dados de outros usuários ou orçamentos
- **Conformidade:** dados de clientes e orçamentos sujeitos à LGPD — isolamento total por usuário
- **Moeda:** todos os valores monetários devem ser em Real Brasileiro (BRL/R$)

## Fora de Escopo

- **Assinatura digital ou eletrônica no orçamento** — o cliente aprova via comunicação externa (WhatsApp, e-mail), não dentro do sistema
- **Pagamentos online integrados** — o orçamento é informativo; pagamento é tratado fora do sistema nesta fase
- **Envio automático por e-mail** — o prestador envia manualmente o PDF ou link; emails transacionais automáticos ficam para fase futura
- **Notificações push ou por e-mail de alterações de status** — serão cobertas em PRDs futuros
- **Relatórios e dashboard de conversão de orçamentos** — métricas de vendas serão cobertas em módulo futuro
- **Catálogo de serviços e materiais pré-cadastrados** — nesta fase, itens são adicionados manualmente por orçamento; catálogo reutilizável será futuro
- **Multiplas moedas** — apenas BRL (R$) nesta fase
- **Impostos e taxas automáticos** — ISS, INSS e outros tributos não serão calculados automaticamente; podem ser incluídos como item de serviço manual
- **Aprovação do cliente pelo link público** — o link é apenas para visualização; botão de "aprovar" pelo cliente será futuro
- **Anexos de imagens ou arquivos ao orçamento** — não incluso nesta fase