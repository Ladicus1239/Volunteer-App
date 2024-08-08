import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import EventManage from "../EventManage";
import { BrowserRouter } from "react-router-dom";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import db from "../../firebase";

jest.mock("../../Components/Navigation", () => () => (
  <nav role="navigation">Mocked Navigation</nav>
));
jest.mock(
  "../../Components/dropdownMS",
  () =>
    ({ selectedItems, setSelectedItems, dataTestId }) =>
      <div data-testid={dataTestId}>Mocked Dropdown Menu</div>
);

jest.mock("firebase/firestore", () => {
  const originalModule = jest.requireActual("firebase/firestore");
  return {
    ...originalModule,
    collection: jest.fn(),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    doc: jest.fn((_, id) => ({ id })),
    onSnapshot: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    getFirestore: jest.fn(() => ({})),
  };
});

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

const renderWithRouter = (ui, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(ui, {
    wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
  });
};

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

const mockEvents = [
  {
    id: "1",
    eventName: "Event 1",
    eventDescription: "Description 1",
    city: "City 1",
    state: "CA",
    requiredSkills: ["Skill 1", "Skill 2"],
    urgency: "low",
    eventDate: "2024-01-01",
  },
  {
    id: "2",
    eventName: "Event 2",
    eventDescription: "Description 2",
    city: "City 2",
    state: "NY",
    requiredSkills: ["Skill 3"],
    urgency: "high",
    eventDate: "2024-02-01",
  },
];

const mockUser = {
  email: "admin@test.com",
};

const mockUserCredential = {
  docs: [
    {
      id: "user1",
      data: () => ({ admin: true }),
    },
  ],
};

test("renders EventManage page correctly", async () => {
  onAuthStateChanged.mockImplementation((auth, callback) => callback(mockUser));
  getDocs.mockResolvedValueOnce(mockUserCredential);
  onSnapshot.mockImplementation((_, callback) => {
    callback({
      docs: mockEvents.map((event) => ({ id: event.id, data: () => event })),
    });
    return jest.fn();
  });

  await act(async () => {
    renderWithRouter(<EventManage />);
  });

  expect(screen.getByRole("navigation")).toBeInTheDocument();
  expect(screen.getByLabelText(/Event Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Event Description/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
  expect(screen.getByTestId("required-skills")).toBeInTheDocument();
  expect(screen.getAllByText(/Urgency/i)[0]).toBeInTheDocument();
  expect(screen.getByLabelText(/Event Date/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /Create Event/i })
  ).toBeInTheDocument();
});

test("creates a new event", async () => {
  onAuthStateChanged.mockImplementation((auth, callback) => callback(mockUser));
  getDocs.mockResolvedValueOnce(mockUserCredential);
  addDoc.mockResolvedValueOnce({ id: "3" });
  collection.mockReturnValueOnce({}); // Mock the collection reference

  onSnapshot.mockImplementation((_, callback) => {
    callback({
      docs: mockEvents.map((event) => ({ id: event.id, data: () => event })),
    });
    return jest.fn();
  });

  await act(async () => {
    renderWithRouter(<EventManage />);
  });

  // Checks if the admin UI elements are present
  expect(
    screen.getByRole("button", { name: /Create Event/i })
  ).toBeInTheDocument();

  // Fills in the form
  fireEvent.change(screen.getByLabelText(/Event Name/i), {
    target: { value: "Test Event" },
  });
  fireEvent.change(screen.getByLabelText(/Event Description/i), {
    target: { value: "This is a test event" },
  });
  fireEvent.change(screen.getByLabelText(/City/i), {
    target: { value: "Test City" },
  });
  fireEvent.change(screen.getByLabelText(/Event Date/i), {
    target: { value: "2024-03-01" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Create Event/i }));

  await waitFor(() => {
    expect(addDoc).toHaveBeenCalledWith(collection(db, "EventDetails"), {
      eventName: "Test Event",
      eventDescription: "This is a test event",
      city: "Test City",
      state: "",
      requiredSkills: [],
      urgency: "low",
      eventDate: "2024-03-01",
    });
  });
});

test("edits an existing event", async () => {
  onAuthStateChanged.mockImplementation((auth, callback) => callback(mockUser));
  getDocs.mockResolvedValueOnce(mockUserCredential);
  updateDoc.mockResolvedValueOnce();
  collection.mockReturnValueOnce({}); // Mock the collection reference
  onSnapshot.mockImplementation((_, callback) => {
    callback({
      docs: mockEvents.map((event) => ({ id: event.id, data: () => event })),
    });
    return jest.fn();
  });

  await act(async () => {
    renderWithRouter(<EventManage />);
  });

  fireEvent.click(screen.getAllByText(/Edit/i)[0]);

  fireEvent.change(screen.getByLabelText(/Event Name/i), {
    target: { value: "Updated Event" },
  });
  fireEvent.change(screen.getByLabelText(/Event Description/i), {
    target: { value: "Updated Description" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Update Event/i }));

  await waitFor(() => {
    expect(updateDoc).toHaveBeenCalledWith(doc(db, "EventDetails", "1"), {
      eventName: "Updated Event",
      eventDescription: "Updated Description",
      city: "City 1",
      state: "CA",
      requiredSkills: ["Skill 1", "Skill 2"],
      urgency: "low",
      eventDate: "2024-01-01",
    });
  });
});

test("deletes an event", async () => {
  onAuthStateChanged.mockImplementation((auth, callback) => callback(mockUser));
  getDocs.mockResolvedValueOnce(mockUserCredential);
  deleteDoc.mockResolvedValueOnce();
  collection.mockReturnValueOnce({}); // Mock the collection reference
  onSnapshot.mockImplementation((_, callback) => {
    callback({
      docs: mockEvents.map((event) => ({ id: event.id, data: () => event })),
    });
    return jest.fn();
  });

  await act(async () => {
    renderWithRouter(<EventManage />);
  });

  fireEvent.click(screen.getAllByText(/Delete/i)[0]);

  await waitFor(() => {
    expect(deleteDoc).toHaveBeenCalledWith(doc(db, "EventDetails", "1"));
  });
});

test("displays events in table", async () => {
  onAuthStateChanged.mockImplementation((auth, callback) => callback(mockUser));
  getDocs.mockResolvedValueOnce(mockUserCredential);
  onSnapshot.mockImplementation((_, callback) => {
    callback({
      docs: mockEvents.map((event) => ({ id: event.id, data: () => event })),
    });
    return jest.fn();
  });

  await act(async () => {
    renderWithRouter(<EventManage />);
  });

  // Utility function to find text in table cells
  const findTextInTable = async (text) => {
    const tableCells = screen.getAllByRole("cell");
    return tableCells.find((cell) => cell.textContent.includes(text));
  };

  // Check for each event in the table
  await waitFor(() => {
    expect(findTextInTable("Event 1")).not.toBeNull();
    expect(findTextInTable("Description 1")).not.toBeNull();
    expect(findTextInTable("City 1")).not.toBeNull();
    expect(findTextInTable("Skill 1, Skill 2")).not.toBeNull();
    expect(findTextInTable("low")).not.toBeNull();
    expect(findTextInTable("2024-01-01")).not.toBeNull();

    expect(findTextInTable("Event 2")).not.toBeNull();
    expect(findTextInTable("Description 2")).not.toBeNull();
    expect(findTextInTable("City 2")).not.toBeNull();
    expect(findTextInTable("Skill 3")).not.toBeNull();
    expect(findTextInTable("high")).not.toBeNull();
    expect(findTextInTable("2024-02-01")).not.toBeNull();
  });
});
