export interface Cliente {
  id: string;
  usuarioId: string;
  nome: string;
  email: string;
  telefone: string | null;
  empresa: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateClienteInput {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
}

export interface UpdateClienteInput {
  nome?: string;
  email?: string;
  telefone?: string;
  empresa?: string;
}

export function useClientes() {
  const client = useSupabaseClient() as any;
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function buscarTodos(): Promise<Cliente[]> {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: err } = await client
        .from("clientes")
        .select("*")
        .order("nome", { ascending: true });

      if (err) throw err;

      return (data ?? []).map(mapCliente);
    } catch (err) {
      error.value = mapError(err);
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function buscarPorId(id: string): Promise<Cliente | null> {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: err } = await client
        .from("clientes")
        .select("*")
        .eq("id", id)
        .single();

      if (err) throw err;

      return data ? mapCliente(data) : null;
    } catch (err) {
      error.value = mapError(err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function criar(input: CreateClienteInput): Promise<string | null> {
    loading.value = true;
    error.value = null;

    try {
      const user = useSupabaseUser();
      const { data, error: err } = await client
        .from("clientes")
        .insert({
          usuario_id: user.value?.id,
          nome: input.nome,
          email: input.email,
          telefone: input.telefone ?? null,
          empresa: input.empresa ?? null,
        })
        .select("id")
        .single();

      if (err) throw err;

      return data?.id ?? null;
    } catch (err) {
      error.value = mapError(err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function atualizar(
    id: string,
    input: UpdateClienteInput,
  ): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const { error: err } = await client
        .from("clientes")
        .update({
          ...(input.nome !== undefined && { nome: input.nome }),
          ...(input.email !== undefined && { email: input.email }),
          ...(input.telefone !== undefined && { telefone: input.telefone }),
          ...(input.empresa !== undefined && { empresa: input.empresa }),
        })
        .eq("id", id);

      if (err) throw err;

      return true;
    } catch (err) {
      error.value = mapError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function excluir(id: string): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const { error: err } = await client
        .from("clientes")
        .delete()
        .eq("id", id);

      if (err) throw err;

      return true;
    } catch (err) {
      error.value = mapError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    buscarTodos,
    buscarPorId,
    criar,
    atualizar,
    excluir,
  };
}

function mapCliente(row: Record<string, unknown>): Cliente {
  return {
    id: row.id as string,
    usuarioId: row.usuario_id as string,
    nome: row.nome as string,
    email: row.email as string,
    telefone: (row.telefone as string) ?? null,
    empresa: (row.empresa as string) ?? null,
    criadoEm: row.criado_em as string,
    atualizadoEm: row.atualizado_em as string,
  };
}

function mapError(err: unknown): string {
  const message = err instanceof Error ? err.message : "";

  if (
    message.includes("violates unique constraint") ||
    message.includes("duplicate")
  ) {
    return "Já existe um cliente com este e-mail.";
  }
  if (message.includes("Network") || message.includes("fetch")) {
    return "Erro de conexão. Verifique sua internet.";
  }
  if (message.includes("constraint")) {
    return "Não é possível excluir: cliente possui orçamentos vinculados.";
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}
