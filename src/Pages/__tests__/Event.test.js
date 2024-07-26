import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Event from "../Event";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("../../Components/Navigation", () => () => (
  <nav role="navigation">Mocked Navigation</nav>
));
jest.mock("../../Components/EventDisplay", () => () => (
  <div role="eventdisplay">Mocked Message</div>
));

describe("Event Component", () => {
  test("renders Navigation component", () => {
    render(
      <Router>
        <Event />
      </Router>
    );
    const navElement = screen.getByText("Mocked Navigation");
    expect(navElement).toBeInTheDocument();
  });

  test("renders the Events header", () => {
    render(
      <Router>
        <Event />
      </Router>
    );
    const headerElement = screen.getByText("Events");
    expect(headerElement).toBeInTheDocument();
  });

  test("renders the Volunteer History button", () => {
    render(
      <Router>
        <Event />
      </Router>
    );
    const volunteerHistoryButton = screen.getByText("Volunteer History");
    expect(volunteerHistoryButton).toBeInTheDocument();
  });

  test("renders the Event Manage button", () => {
    render(
      <Router>
        <Event />
      </Router>
    );
    const eventManageButton = screen.getByText("Event Manage");
    expect(eventManageButton).toBeInTheDocument();
  });

  test("renders the Volunteer Matching button", () => {
    render(
      <Router>
        <Event />
      </Router>
    );
    const volunteerMatchingButton = screen.getByText("Volunteer Matching");
    expect(volunteerMatchingButton).toBeInTheDocument();
  });

  test("renders EventDisplay component", () => {
    render(
      <Router>
        <Event />
      </Router>
    );
    const eventDisplayElement = screen.getByText("Mocked EventDisplay");
    expect(eventDisplayElement).toBeInTheDocument();
  });
});
