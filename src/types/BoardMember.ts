export interface BoardMember {
  id: string;
  headshotUpdatedAt: string;
  position: string;
  fullName: string;
  bio: string;
  major: string;
  year: string;
  hometown: string;
  linkedinUrl: string | null;
  email: string;
  headshotFile: string | null;
  orderIndex: number;
}
