export type ConferenceItem = {
  id: string;
  starts_at: string;
  ends_at: string | null;
  venue: string;
  address: string | null;
  paf: string | null;
  country: string | null;
  status: string;
  ticket_url: string | null;
  rsvp_url: string | null;
};

export type ConferencesPayload = {
  future: ConferenceItem[];
  past: ConferenceItem[];
  error: string | null;
};
