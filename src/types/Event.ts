export interface Event {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  company: string | null;
  startTime: string;
  endTime: string | null;
  location: string | null;
  flyerFile: string | null;
  rsvpLink: string | null;
  description: string | null;
  semester: string;
}

export interface EventsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  semester?: string;
  startDate?: string;
  endDate?: string;
  sort?: 'startTime:asc' | 'startTime:desc';
}
