import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Event from "../Event";
import { BrowserRouter as Router } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, query, collection, where } from "firebase/firestore";
import db from "../../firebase";
import { useNavigate } from "react-router-dom";

jest.mock("../../Components/Navigation", () => () => (
  <nav role="navigation">Mocked Navigation</nav>
));
jest.mock("../../Components/EventDisplay", () => () => (
  <div role="eventdisplay">Mocked EventDisplay</div>
));

// Mocking Firebase functions
jest.mock("firebase/auth");
jest.mock("firebase/firestore");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Event Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    getAuth.mockReturnValue({
      currentUser: { email: "test@example.com" },
    });

    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ email: "test@example.com" });
    });

    getDocs.mockResolvedValue({
      empty: false,
      docs: [{ data: () => ({ email: "test@example.com", admin: true }) }],
    });

    useNavigate.mockReturnValue(mockNavigate);

    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

  test("renders the Event Manage button", async () => {
    render(
      <Router>
        <Event />
      </Router>
    );
    const eventManageButton = await screen.findByText("Event Manage");
    expect(eventManageButton).toBeInTheDocument();
  });

  test("renders the Volunteer Matching button", async () => {
    render(
      <Router>
        <Event />
      </Router>
    );
    const volunteerMatchingButton = await screen.findByText(
      "Volunteer Matching"
    );
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

  test("alerts and navigates if user is not registered", async () => {
    getDocs.mockResolvedValue({ empty: true });

    render(
      <Router>
        <Event />
      </Router>
    );

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Register to view this page.");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("alerts and navigates if user is not logged in", async () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
    });

    render(
      <Router>
        <Event />
      </Router>
    );

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "You need to be logged in to access this page."
      );
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});