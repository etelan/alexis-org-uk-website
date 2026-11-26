import { render } from "@testing-library/react";
import { jest } from "@jest/globals";
import { CursorPresence } from "./cursor-presence";

// Minimal WebSocket replacement for lifecycle tests.
class MockWebSocket {
  static instances: MockWebSocket[] = [];

  closed = false;

  constructor(readonly url: string) {
    MockWebSocket.instances.push(this);
  }

  addEventListener() {}

  close() {
    this.closed = true;
  }
}

describe("CursorPresence cursor integration", () => {
  beforeEach(() => {
    // Avoid real browser animation loops in the test environment.
    MockWebSocket.instances = [];
    Object.defineProperty(window, "WebSocket", {
      configurable: true,
      writable: true,
      value: MockWebSocket,
    });
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1);
    jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("opens_the_cursor_websocket_when_the_menu_mounts", () => {
    render(<CursorPresence />);
    const socket = MockWebSocket.instances[0];

    expect(MockWebSocket.instances).toHaveLength(1);
    expect(socket.url).toBe("ws://localhost/ws/homepage");
  });

  test("closes_the_cursor_websocket_on_unmount", () => {
    const { unmount } = render(<CursorPresence />);
    const socket = MockWebSocket.instances[0];

    unmount();

    expect(socket.closed).toBe(true);
  });
});
