export type ActivityItem = {
  id: string;
  user: string;
  text: string;
  time: string;
  avatarUrl: string;
};

export const mockActivity: ActivityItem[] = [
  {
    id: '1',
    user: 'Livia M.',
    text: 'curtiu seu item “Funko Pop Goku Ultra Instinct”.',
    time: 'há 2h',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '2',
    user: 'Rafael T.',
    text: 'comentou no seu item “Miniatura de Ducati”.',
    time: 'há 4h',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '3',
    user: 'Nina C.',
    text: 'fez uma proposta de troca por “Baralho Pokémon 1999”.',
    time: 'há 6h',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '4',
    user: 'Pedro H.',
    text: 'deu um lance de compra em “Game Boy Advance SP”.',
    time: 'há 1d',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  },
];
