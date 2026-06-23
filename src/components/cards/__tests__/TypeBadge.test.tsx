import { render, screen } from "@testing-library/react";
import { TypeBadge } from "../TypeBadge";

describe("TypeBadge", () => {
  it("renders type name capitalized", () => {
    render(<TypeBadge typeName="fire" />);
    expect(screen.getByText("FIRE")).toBeInTheDocument();
  });

  it("applies correct background color", () => {
    const { container } = render(<TypeBadge typeName="water" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.style.backgroundColor).toBe("rgb(104, 144, 240)");
  });

  it("handles unknown type gracefully", () => {
    const { container } = render(<TypeBadge typeName="unknown" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.style.backgroundColor).toBe("rgb(104, 160, 144)");
    expect(screen.getByText("UNKNOWN")).toBeInTheDocument();
  });
});
