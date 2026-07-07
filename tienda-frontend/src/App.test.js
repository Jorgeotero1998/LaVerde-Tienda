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

test("renders La Verde storefront shell", () => {
  const AppWithContext = injectContext(App);
  render(<AppWithContext />);
  expect(screen.getByText(/La Verde/i)).toBeInTheDocument();
});
