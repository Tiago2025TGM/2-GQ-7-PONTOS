export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  github?: string;
  avatar?: string;
  funFact: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Tiago',
    role: 'Full-Stack Developer',
    bio: 'Desenvolvedor apaixonado por tecnologia e leitura. Responsável por todo o desenvolvimento do aplicativo BookShelf.',
    github: 'Tiago2025TGM',
    funFact: 'Já leu mais de 50 livros este ano!',
  },
];
