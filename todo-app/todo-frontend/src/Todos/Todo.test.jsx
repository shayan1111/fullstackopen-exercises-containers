import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Todo from "./Todo";

describe("Todo component tests", () => {
  it("A todo is rendered with it's text", () => {
    const todoSample = {
        text: "This is a todo test",
        done: false
      }

    render(
      <Todo todo={todoSample} completeTodo={() => {}} deleteTodo={() => {}} />
    )

    expect(screen.getByText("This is a todo test")).toBeInTheDocument()
    expect(screen.queryByText("Unavailable text")).not.toBeInTheDocument()
  })
})