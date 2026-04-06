import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import AppTextarea from "~/components/atoms/AppTextarea.vue";

describe("AppTextarea", () => {
  it("renderiza com label", () => {
    render(AppTextarea, {
      props: {
        id: "test-textarea",
        label: "Observações",
        modelValue: "",
      },
    });

    expect(screen.getByText("Observações")).toBeInTheDocument();
    expect(screen.getByLabelText("Observações")).toBeInTheDocument();
  });

  it("emite update:modelValue quando o valor muda", async () => {
    const { emitted } = render(AppTextarea, {
      props: {
        id: "test-textarea",
        label: "Observações",
        modelValue: "",
      },
    });

    const textarea = screen.getByLabelText("Observações");
    await fireEvent.update(textarea, "Texto de teste");

    expect(emitted("update:modelValue")).toBeTruthy();
    expect(emitted("update:modelValue")![0]).toEqual(["Texto de teste"]);
  });

  it("exibe mensagem de erro quando prop error é fornecido", () => {
    render(AppTextarea, {
      props: {
        id: "test-textarea",
        label: "Observações",
        modelValue: "",
        error: "Campo obrigatório",
      },
    });

    expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("respeita o número de rows configurado", () => {
    render(AppTextarea, {
      props: {
        id: "test-textarea",
        label: "Observações",
        modelValue: "",
        rows: 5,
      },
    });

    const textarea = screen.getByLabelText("Observações");
    expect(textarea).toHaveAttribute("rows", "5");
  });

  it("fica desabilitado quando disabled é true", () => {
    render(AppTextarea, {
      props: {
        id: "test-textarea",
        label: "Observações",
        modelValue: "",
        disabled: true,
      },
    });

    const textarea = screen.getByLabelText("Observações");
    expect(textarea).toBeDisabled();
  });
});
