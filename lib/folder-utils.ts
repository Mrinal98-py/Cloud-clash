export const getFolderIconColor = (type: string) => {
  switch (type) {
    case 'image':
      return 'bg-blue-500';
    case 'video':
      return 'bg-red-500';
    case 'document':
      return 'bg-orange-500';
    case 'audio':
      return 'bg-green-500';
    case 'other':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

export const getFolderIcon = (type: string) => {
  switch (type) {
    case 'image':
      return '/assets/icons/images.svg';
    case 'video':
      return '/assets/icons/video.svg';
    case 'document':
      return '/assets/icons/documents.svg';
    case 'audio':
      return '/assets/icons/file-audio.svg';
    case 'other':
      return '/assets/icons/file-other.svg';
    default:
      return '/assets/icons/folder.svg';
  }
};
