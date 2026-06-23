import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorMessage } from "../ErrorMessage";

describe("ErrorMessage", () => {
  it("renders error message text", () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText("SYSTEM ERROR")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("shows retry button when onRetry provided", () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Error" onRetry={onRetry} />);
    fireEvent.click(screen.getByText("RETRY"));
    expect(onRetry).toHaveBeenCalled();
  });

  it("hides retry button when onRetry not provided", () => {
    render(<ErrorMessage message="Error" />);
    expect(screen.queryByText("RETRY")).not.toBeInTheDocument();
  });
});
