export interface AvatarDef {
  id: string;
  name: string;
  bgFrom: string;
  bgTo: string;
  accent: string;
  pattern: 'star' | 'arch' | 'tiles' | 'rings';
}

export const AVATARS: AvatarDef[] = [
  { id: 'a1', name: 'Изумруд', bgFrom: '#0f5340', bgTo: '#06301f', accent: '#ddbc6b', pattern: 'star' },
  { id: 'a2', name: 'Золото', bgFrom: '#c9a24b', bgTo: '#8a6a22', accent: '#faf6ec', pattern: 'arch' },
  { id: 'a3', name: 'Ночь', bgFrom: '#123c4e', bgTo: '#08222e', accent: '#63d9b3', pattern: 'tiles' },
  { id: 'a4', name: 'Крем', bgFrom: '#f4ecd9', bgTo: '#ddc9a3', accent: '#0f5340', pattern: 'star' },
  { id: 'a5', name: 'Лес', bgFrom: '#1d5c3a', bgTo: '#0b3a24', accent: '#f5ebcd', pattern: 'rings' },
  { id: 'a6', name: 'Медь', bgFrom: '#9c5a30', bgTo: '#5f3016', accent: '#f5ebcd', pattern: 'tiles' },
  { id: 'a7', name: 'Индиго', bgFrom: '#3b4b8c', bgTo: '#1d2750', accent: '#ddbc6b', pattern: 'arch' },
  { id: 'a8', name: 'Олива', bgFrom: '#6a7c3f', bgTo: '#3c4a20', accent: '#f5ebcd', pattern: 'rings' },
];

export function avatarById(id: string): AvatarDef {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}
