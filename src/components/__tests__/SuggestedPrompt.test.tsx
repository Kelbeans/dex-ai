import { render, screen, fireEvent } from "@testing-library/react";
import { SuggestedPrompt } from "../SuggestedPrompt";

describe("SuggestedPrompt", () => {
  it("renders the prompt text", () => {
    render(<SuggestedPrompt text="Tell me about Pikachu" onClick={() => {}} />);
    expect(screen.getByText("Tell me about Pikachu")).toBeInTheDocument();
  });

  it("calls onClick with text when clicked", () => {
    const onClick = vi.fn();
    render(<SuggestedPrompt text="Test prompt" onClick={onClick} />);
    fireEvent.click(screen.getByText("Test prompt"));
    expect(onClick).toHaveBeenCalledWith("Test prompt");
  });
});
