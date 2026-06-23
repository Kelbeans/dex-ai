import { render, screen, fireEvent } from "@testing-library/react";
import { GenTabs } from "../GenTabs";

describe("GenTabs", () => {
  it("renders all 9 generation tabs", () => {
    render(<GenTabs activeGen={1} onGenChange={() => {}} />);
    expect(screen.getByText("I")).toBeInTheDocument();
    expect(screen.getByText("II")).toBeInTheDocument();
    expect(screen.getByText("III")).toBeInTheDocument();
    expect(screen.getByText("IV")).toBeInTheDocument();
    expect(screen.getByText("V")).toBeInTheDocument();
    expect(screen.getByText("VI")).toBeInTheDocument();
    expect(screen.getByText("VII")).toBeInTheDocument();
    expect(screen.getByText("VIII")).toBeInTheDocument();
    expect(screen.getByText("IX")).toBeInTheDocument();
  });

  it("highlights the active generation tab", () => {
    render(<GenTabs activeGen={3} onGenChange={() => {}} />);
    const activeButton = screen.getByText("III");
    expect(activeButton.className).toContain("text-red-500");
  });

  it("calls onGenChange when tab clicked", () => {
    const onGenChange = vi.fn();
    render(<GenTabs activeGen={1} onGenChange={onGenChange} />);
    fireEvent.click(screen.getByText("III"));
    expect(onGenChange).toHaveBeenCalledWith(3);
  });

  it("calls onGenChange with correct gen for last tab", () => {
    const onGenChange = vi.fn();
    render(<GenTabs activeGen={1} onGenChange={onGenChange} />);
    fireEvent.click(screen.getByText("IX"));
    expect(onGenChange).toHaveBeenCalledWith(9);
  });
});
