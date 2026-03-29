import { getNowPlaying, type NowPlayingResult } from "@/lib/spotify";

const encoder = new TextEncoder();
const clients = new Set<ReadableStreamDefaultController<Uint8Array>>();
let latestData: NowPlayingResult | null = null;
let timer: ReturnType<typeof setInterval> | null = null;

function broadcast() {
  if (!latestData) return;
  const msg = encoder.encode(`data: ${JSON.stringify(latestData)}\n\n`);
  for (const ctrl of clients) {
    try {
      ctrl.enqueue(msg);
    } catch {
      clients.delete(ctrl);
    }
  }
}

async function startPolling() {
  if (timer !== null) return;
  // Fetch immediately so the connecting client gets data ASAP
  latestData = await getNowPlaying();
  broadcast();
  timer = setInterval(async () => {
    if (clients.size === 0) {
      clearInterval(timer!);
      timer = null;
      return;
    }
    latestData = await getNowPlaying();
    broadcast();
  }, 10_000);
}

export async function GET() {
  let ctrl!: ReadableStreamDefaultController<Uint8Array>;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      ctrl = controller;
      clients.add(controller);
      // Send cached data immediately if available, before the first poll completes
      if (latestData) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(latestData)}\n\n`)
        );
      }
      startPolling(); // fire-and-forget; handles dedup via timer guard
    },
    cancel() {
      clients.delete(ctrl);
      if (clients.size === 0 && timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
