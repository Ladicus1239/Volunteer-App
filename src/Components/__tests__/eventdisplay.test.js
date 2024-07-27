import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { collection, onSnapshot } from "firebase/firestore";
import EventDisplay from "../eventdisplay";
import "@testing-library/jest-dom";

jest.mock("firebase/firestore", () => {
  const originalModule = jest.requireActual("firebase/firestore");
  return {
    ...originalModule,
    getFirestore: jest.fn(),
    collection: jest.fn(),
    onSnapshot: jest.fn(),
  };
});

const sampleEvents = [
  {
    id: "1",
    eventName: "Sample Event 1",
    eventDescription: "Description for sample event 1",
    city: "City 1",
    state: "State 1",
    requiredSkills: ["Skill 1", "Skill 2"],
    urgency: "High",
    eventDate: "2023-08-01",
  },
  {
    id: "2",
    eventName: "Sample Event 2",
    eventDescription: "Description for sample event 2",
    city: "City 2",
    state: "State 2",
    requiredSkills: ["Skill 3", "Skill 4"],
    urgency: "Medium",
    eventDate: "2023-09-01",
  },
];

beforeEach(() => {
  onSnapshot.mockImplementation((_, callback) => {
    callback({
      docs: sampleEvents.map((event) => ({
        id: event.id,
        data: () => event,
      })),
    });

    return jest.fn();
  });
});

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

test("renders EventDisplay component", async () => {
  render(<EventDisplay />);

  expect(screen.getByText("Event Name")).toBeInTheDocument();
  expect(screen.getByText("Event Description")).toBeInTheDocument();
});

test("displays event details correctly", async () => {
  render(<EventDisplay />);

  await waitFor(() => {
    sampleEvents.forEach((event) => {
      expect(screen.getByText(event.eventName)).toBeInTheDocument();
      expect(screen.getByText(event.eventDescription)).toBeInTheDocument();
      expect(screen.getByText(event.city)).toBeInTheDocument();
      expect(screen.getByText(event.state)).toBeInTheDocument();
      expect(
        screen.getByText(event.requiredSkills.join(", "))
      ).toBeInTheDocument();
      expect(screen.getByText(event.urgency)).toBeInTheDocument();
      expect(
        screen.getByText(
          new Date(event.eventDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        )
      ).toBeInTheDocument();
    });
  });
});

test("handles empty events array", async () => {
  onSnapshot.mockImplementation((_, callback) => {
    callback({ docs: [] });

    return jest.fn();
  });

  render(<EventDisplay />);

  await waitFor(() => {
    expect(screen.queryByText("Sample Event 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Sample Event 2")).not.toBeInTheDocument();
  });
});

test("handles non-array requiredSkills", async () => {
  const eventsWithNonArraySkills = [
    {
      id: "3",
      eventName: "Event with String Skills",
      eventDescription: "Description",
      city: "City",
      state: "State",
      requiredSkills: "Skill 1, Skill 2",
      urgency: "Low",
      eventDate: "2023-10-01",
    },
  ];

  onSnapshot.mockImplementation((_, callback) => {
    callback({
      docs: eventsWithNonArraySkills.map((event) => ({
        id: event.id,
        data: () => event,
      })),
    });

    return jest.fn();
  });

  render(<EventDisplay />);

  await waitFor(() => {
    expect(screen.getByText("Event with String Skills")).toBeInTheDocument();
    expect(
      screen.getByText(
        (content, element) =>
          content.startsWith("Skill 1") && content.includes("Skill 2")
      )
    ).toBeInTheDocument();
  });
});

test("handles no events in Firestore", async () => {
  onSnapshot.mockImplementation((_, callback) => {
    callback({ docs: [] });

    return jest.fn();
  });

  render(<EventDisplay />);

  await waitFor(() => {
    expect(screen.queryByText("Event Name")).toBeInTheDocument();
    expect(screen.queryByText("Event Description")).toBeInTheDocument();
    expect(screen.queryByText("No events available")).not.toBeInTheDocument();
  });
});