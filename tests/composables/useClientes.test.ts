import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { useClientes } from "~/composables/useClientes";

describe("useClientes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("buscarTodos", () => {
    it("retorna lista de clientes", async () => {
      const mockData = [
        {
          id: "1",
          usuario_id: "user1",
          nome: "João Silva",
          email: "joao@email.com",
          telefone: "(11) 99999-9999",
          empresa: "Empresa A",
          criado_em: "2026-01-01T00:00:00Z",
          atualizado_em: "2026-01-01T00:00:00Z",
        },
      ];

      vi.stubGlobal("useSupabaseClient", () => ({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      }));

      const { buscarTodos } = useClientes();
      const result = await buscarTodos();

      expect(result).toHaveLength(1);
      expect(result[0].nome).toBe("João Silva");
      expect(result[0].email).toBe("joao@email.com");
    });

    it("retorna lista vazia em caso de erro", async () => {
      vi.stubGlobal("useSupabaseClient", () => ({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            order: vi
              .fn()
              .mockResolvedValue({ data: null, error: new Error("Erro") }),
          }),
        }),
      }));

      const { buscarTodos } = useClientes();
      const result = await buscarTodos();

      expect(result).toEqual([]);
    });
  });

  describe("criar", () => {
    it("insere cliente no banco e retorna ID", async () => {
      vi.stubGlobal("useSupabaseClient", () => ({
        from: vi.fn().mockReturnValue({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi
                .fn()
                .mockResolvedValue({ data: { id: "new-id" }, error: null }),
            }),
          }),
        }),
      }));

      const { criar } = useClientes();
      const result = await criar({
        nome: "Maria Souza",
        email: "maria@email.com",
      });

      expect(result).toBe("new-id");
    });
  });

  describe("atualizar", () => {
    it("modifica cliente existente e retorna true", async () => {
      vi.stubGlobal("useSupabaseClient", () => ({
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      }));

      const { atualizar } = useClientes();
      const result = await atualizar("cliente-id", { nome: "Nome Atualizado" });

      expect(result).toBe(true);
    });

    it("retorna false em caso de erro", async () => {
      vi.stubGlobal("useSupabaseClient", () => ({
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: new Error("Erro") }),
          }),
        }),
      }));

      const { atualizar } = useClientes();
      const result = await atualizar("cliente-id", { nome: "Nome" });

      expect(result).toBe(false);
    });
  });

  describe("excluir", () => {
    it("remove cliente e retorna true", async () => {
      vi.stubGlobal("useSupabaseClient", () => ({
        from: vi.fn().mockReturnValue({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      }));

      const { excluir } = useClientes();
      const result = await excluir("cliente-id");

      expect(result).toBe(true);
    });

    it("retorna false em caso de erro", async () => {
      vi.stubGlobal("useSupabaseClient", () => ({
        from: vi.fn().mockReturnValue({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: new Error("Erro") }),
          }),
        }),
      }));

      const { excluir } = useClientes();
      const result = await excluir("cliente-id");

      expect(result).toBe(false);
    });
  });
});
