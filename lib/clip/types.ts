export type ClipboardRole = "read" | "write";

export interface Clipboard {
  id: string;
  name: string;
  created_by: string | null;
  created_at: string;
}

export interface ClipboardMember {
  id: string;
  clipboard_id: string;
  user_id: string;
  role: ClipboardRole;
  created_at: string;
}

export interface ClipboardEntry {
  id: string;
  clipboard_id: string;
  user_id: string | null;
  content: string;
  created_at: string;
}

export interface ClipboardWithRole extends Clipboard {
  role: ClipboardRole;
}
