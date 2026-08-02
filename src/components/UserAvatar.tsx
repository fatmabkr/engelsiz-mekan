import React from 'react';

interface UserAvatarProps {
  name?: string;
  photoURL?: string;
  size?: number;
  className?: string;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
};

const getGradient = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${h1}, 70%, 45%), hsl(${h2}, 65%, 55%))`;
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name = 'Kullanıcı',
  photoURL = '',
  size = 40,
  className = '',
}) => {
  const sizeStyle = { width: size, height: size, minWidth: size, minHeight: size };
  const fontSize = Math.max(size * 0.35, 10);

  if (photoURL && photoURL !== '') {
    return (
      <img
        src={photoURL}
        alt={name}
        className={`rounded-full object-cover ${className}`}
        style={sizeStyle}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-black select-none ${className}`}
      style={{
        ...sizeStyle,
        background: getGradient(name),
        fontSize: `${fontSize}px`,
        lineHeight: 1,
      }}
    >
      {getInitials(name)}
    </div>
  );
};

export default UserAvatar;
