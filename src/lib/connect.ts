import { apiFetch } from "./api";
import type { Room, RoomDetail, Message } from "@/types/connect";

export async function getRooms() {
  return apiFetch<Room[]>("/connect/rooms/");
}

export async function getRoom(slug: string) {
  return apiFetch<RoomDetail>(`/connect/rooms/${slug}/`);
}

export async function postMessage(
  slug: string,
  content: string
): Promise<Message> {
  return apiFetch<Message>(
    `/connect/rooms/${slug}/messages/`,
    {
      method: "POST",
      body: JSON.stringify({
        content,
      }),
    }
  );
}