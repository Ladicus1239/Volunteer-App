import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EventManage from "./EventManage";
import "@testing-library/jest-dom";

describe("EventManage Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders create event form", () => {
    render(<EventManage />);

    expect(
      screen.getByPlaceholderText("Event Name* (100 character limit)")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Event Description*")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Location*")).toBeInTheDocument();
    expect(screen.getByLabelText("Required Skills*:")).toBeInTheDocument();
    expect(screen.getByLabelText("Urgency*:")).toBeInTheDocument();
    expect(screen.getByLabelText("Event Date*:")).toBeInTheDocument();
  });

  test("creates and displays a new event", () => {
    render(<EventManage />);

    fireEvent.change(
      screen.getByPlaceholderText("Event Name* (100 character limit)"),
      {
        target: { value: "Test Event" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Event Description*"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByPlaceholderText("Location*"), {
      target: { value: "Test Location" },
    });
    fireEvent.change(screen.getByLabelText("Required Skills*:"), {
      target: { value: "Skill1" },
    });
    fireEvent.change(screen.getByLabelText("Urgency*:"), {
      target: { value: "high" },
    });
    fireEvent.change(screen.getByLabelText("Event Date*:"), {
      target: { value: "2024-07-31" },
    });

    fireEvent.click(screen.getByText("Create Event"));

    expect(screen.getByText("Test Event")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test Location")).toBeInTheDocument();
    expect(screen.getByText("Skill1")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
    expect(screen.getByText("2024-07-31")).toBeInTheDocument();
  });

  test("edits an existing event", () => {
    render(<EventManage />);

    fireEvent.change(
      screen.getByPlaceholderText("Event Name* (100 character limit)"),
      {
        target: { value: "Test Event" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Event Description*"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByPlaceholderText("Location*"), {
      target: { value: "Test Location" },
    });
    fireEvent.change(screen.getByLabelText("Required Skills*:"), {
      target: { value: "Skill1" },
    });
    fireEvent.change(screen.getByLabelText("Urgency*:"), {
      target: { value: "high" },
    });
    fireEvent.change(screen.getByLabelText("Event Date*:"), {
      target: { value: "2024-07-31" },
    });

    fireEvent.click(screen.getByText("Create Event"));

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(
      screen.getByPlaceholderText("Event Name* (100 character limit)"),
      {
        target: { value: "Updated Event" },
      }
    );
    fireEvent.click(screen.getByText("Update Event"));

    expect(screen.getByText("Updated Event")).toBeInTheDocument();
  });

  test("deletes an event", () => {
    render(<EventManage />);

    fireEvent.change(
      screen.getByPlaceholderText("Event Name* (100 character limit)"),
      {
        target: { value: "Test Event" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Event Description*"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByPlaceholderText("Location*"), {
      target: { value: "Test Location" },
    });
    fireEvent.change(screen.getByLabelText("Required Skills*:"), {
      target: { value: "Skill1" },
    });
    fireEvent.change(screen.getByLabelText("Urgency*:"), {
      target: { value: "high" },
    });
    fireEvent.change(screen.getByLabelText("Event Date*:"), {
      target: { value: "2024-07-31" },
    });

    fireEvent.click(screen.getByText("Create Event"));

    fireEvent.click(screen.getByText("Delete"));

    expect(screen.queryByText("Test Event")).not.toBeInTheDocument();
  });
});
