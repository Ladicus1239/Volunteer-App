import "@testing-library/jest-dom";
import { matchVolunteersToEvents } from "../VolunteerMatching";

describe("matchVolunteersToEvents", () => {
  const volunteers = [
    {
      id: 1,
      name: "Alice",
      skills: ["cooking", "teaching"],
      availability: ["weekends"],
      location: "New York",
      preferences: ["teaching"],
    },
    {
      id: 2,
      name: "Bob",
      skills: ["driving", "cooking"],
      availability: ["weekdays", "weekends"],
      location: "Los Angeles",
      preferences: ["driving"],
    },
  ];

  const events = [
    {
      id: 1,
      name: "Community Cooking Class",
      skillsRequired: ["cooking"],
      date: "2024-07-29",
      location: "New York",
      type: "teaching",
    },
    {
      id: 2,
      name: "Food Delivery",
      skillsRequired: ["driving"],
      date: "2024-07-29",
      location: "Los Angeles",
      type: "driving",
    },
  ];

  it("matches volunteers to events based on skills, availability, location, and preferences", () => {
    const expectedMatches = [
      {
        event: "Community Cooking Class",
        volunteers: ["Alice"],
      },
      {
        event: "Food Delivery",
        volunteers: ["Bob"],
      },
    ];

    const matches = matchVolunteersToEvents(volunteers, events);
    expect(matches).toEqual(expectedMatches);
  });

  it("returns an empty list of volunteers if no volunteers match an event", () => {
    const newEvent = {
      id: 3,
      name: "Gardening Workshop",
      skillsRequired: ["gardening"],
      date: "2024-07-29",
      location: "San Francisco",
      type: "gardening",
    };

    const newEvents = [...events, newEvent];

    const expectedMatches = [
      {
        event: "Community Cooking Class",
        volunteers: ["Alice"],
      },
      {
        event: "Food Delivery",
        volunteers: ["Bob"],
      },
      {
        event: "Gardening Workshop",
        volunteers: [],
      },
    ];

    const matches = matchVolunteersToEvents(volunteers, newEvents);
    expect(matches).toEqual(expectedMatches);
  });

  it("does not match volunteers if location does not match", () => {
    const newVolunteers = [
      {
        id: 1,
        name: "Alice",
        skills: ["cooking", "teaching"],
        availability: ["weekends"],
        location: "Chicago",
        preferences: ["teaching"],
      },
    ];

    const expectedMatches = [
      {
        event: "Community Cooking Class",
        volunteers: [],
      },
      {
        event: "Food Delivery",
        volunteers: ["Bob"],
      },
    ];

    const matches = matchVolunteersToEvents(newVolunteers, events);
    expect(matches).toEqual(expectedMatches);
  });
});
