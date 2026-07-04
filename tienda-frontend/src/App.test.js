import { render, screen } from "@testing-library/react";
import App from "./App";
import injectContext from "./injectContext";

beforeEach(() => {
  global.fetch = jest.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => [],
  }));
});

afterEach(() => {
  jest.resetAllMocks();
});

test("renders home hero title", () => {
  const AppWithContext = injectContext(App);
  render(<AppWithContext />);
  expect(screen.getByRole("heading", { name: /frescura directa a tu hogar/i })).toBeInTheDocument();
});
