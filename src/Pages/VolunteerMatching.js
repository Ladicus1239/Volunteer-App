import Navigation from "../Components/Navigation";
import "../styles.css";

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

function matchVolunteersToEvents(volunteers, events) {
  const matches = [];

  events.forEach((event) => {
    const matchedVolunteers = volunteers.filter((volunteer) => {
      const skillsMatch = event.skillsRequired.every((skill) =>
        volunteer.skills.includes(skill)
      );
      const timeMatch = volunteer.availability.includes(event.time);
      const locationMatch = volunteer.location === event.location;
      const preferenceMatch = volunteer.preferences.includes(event.type);

      return skillsMatch && timeMatch && locationMatch && preferenceMatch;
    });

    matches.push({
      event: event.name,
      volunteers: matchedVolunteers.map((v) => v.name),
    });
  });

  return matches;
}

const matches = matchVolunteersToEvents(volunteers, events);
console.log(matches);
