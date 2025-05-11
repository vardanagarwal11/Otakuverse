
export interface Community {
  id: number;
  name: string;
  image: string;
  icon: string;
  members: number;
  posts: number;
  theme: string;
  description: string;
  categories: string[];
  features?: string[];
  joinedDate?: string;
  topContributor?: string;
  events?: {
    title: string;
    date: string;
  }[];
}
