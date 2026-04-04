interface UseAuthStateReturn {
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

function mapAuthError(error: unknown): string {
  const message =
    error instanceof Error
      ? error.message
      : ((error as { message?: string })?.message ?? "");

  if (message.includes("Invalid login credentials")) {
    return "E-mail ou senha inválidos";
  }
  if (message.includes("Email not confirmed")) {
    return "Verifique seu e-mail para ativar sua conta";
  }
  if (
    message.includes("Network") ||
    message.includes("fetch") ||
    message.includes("connect")
  ) {
    return "Erro de conexão. Tente novamente.";
  }
  return "Ocorreu um erro inesperado. Tente novamente.";
}

export function useAuthState(): UseAuthStateReturn {
  const isLoading = useState<boolean>("auth:loading", () => false);
  const error = useState<string | null>("auth:error", () => null);

  async function login(email: string, password: string): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    try {
      const client = useSupabaseClient();
      const { data, error: authError } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        error.value = mapAuthError(authError);
        return false;
      }

      return !!data.user;
    } catch (err) {
      error.value = mapAuthError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout(): Promise<void> {
    try {
      const client = useSupabaseClient();
      await client.auth.signOut();
    } catch {
      // Ignora erros ao encerrar sessão
    } finally {
      isLoading.value = false;
      error.value = null;
    }
  }

  function clearError(): void {
    error.value = null;
  }

  return { isLoading, error, login, logout, clearError };
}
