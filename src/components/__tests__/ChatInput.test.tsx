import { render, screen, fireEvent } from "@testing-library/react";
import { ChatInput } from "../ChatInput";

describe("ChatInput", () => {
  it("calls onSubmit with input value and clears field", () => {
    const onSubmit = vi.fn();
    render(<ChatInput onSubmit={onSubmit} disabled={false} />);
    const input = screen.getByPlaceholderText(/ask/i);
    fireEvent.change(input, { target: { value: "Tell me about Pikachu" } });
    fireEvent.submit(input.closest("form")!);
    expect(onSubmit).toHaveBeenCalledWith("Tell me about Pikachu");
    expect(input).toHaveValue("");
  });

  it("prevents submission when disabled", () => {
    const onSubmit = vi.fn();
    render(<ChatInput onSubmit={onSubmit} disabled={true} />);
    const input = screen.getByPlaceholderText(/ask/i);
    expect(input).toBeDisabled();
  });

  it("does not submit empty input", () => {
    const onSubmit = vi.fn();
    render(<ChatInput onSubmit={onSubmit} disabled={false} />);
    const input = screen.getByPlaceholderText(/ask/i);
    fireEvent.submit(input.closest("form")!);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
