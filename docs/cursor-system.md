# Cursor System

This app has a small real-time cursor presence system.

## Flow

1. `CursorPresence` is a drop-in React component.
2. It opens a WebSocket to `/ws/homepage`.
3. Mouse movement is throttled to 10 sends per second.
4. If the mouse stops moving for 5 seconds, sending pauses but the socket stays open.
5. The Worker routes `/ws/*` requests to a Durable Object room.
6. The Durable Object stores one session per connected socket.
7. Cursor updates are broadcast to everyone else in the same room.

## Rooms And Durable Objects

- A "room" is just a named Durable Object instance.
- `/ws/homepage` maps to the `homepage` room.
- The same room name always points to the same Durable Object.
- This app currently uses one room in practice, because the client connects to `/ws/homepage`.
- You could add more rooms later by changing the WebSocket path.

## Files

- [`app/components/cursor-presence.tsx`](/Users/alexis.baker/Repositories/PERSONAL/alexis-org-uk-website/app/components/cursor-presence.tsx)
- [`workers/cursor-room-router.ts`](/Users/alexis.baker/Repositories/PERSONAL/alexis-org-uk-website/workers/cursor-room-router.ts)
- [`workers/cursor-room.ts`](/Users/alexis.baker/Repositories/PERSONAL/alexis-org-uk-website/workers/cursor-room.ts)
- [`workers/cursor-protocol.ts`](/Users/alexis.baker/Repositories/PERSONAL/alexis-org-uk-website/workers/cursor-protocol.ts)

## Data Model

- `CursorSession` identity attached to websocket associated (aka, one visitor of a room (DurableObject)):
  - `id`
  - `name`
  - `color`
- `CursorPosition` is the payload sent from the browser:
  - `x`
  - `y`
- `CursorMessage` is a server broadcast that combines `CursorSession` and `CursorPosition`.
- `ServerMessage` is the union of all messages the browser can receive:
  - `welcome`
  - `cursor`
  - `leave`
- `CursorPresence` keeps local UI state in a `Record<string, Cursor>`, where `Cursor` is `CursorSession` plus `x` and `y`.

## Notes

- The browser only sends `{ x, y }` cursor positions.
- The room name comes from the URL path, so `/ws/homepage` maps to the `homepage` room.
- The same room name always points to the same Durable Object instance.
