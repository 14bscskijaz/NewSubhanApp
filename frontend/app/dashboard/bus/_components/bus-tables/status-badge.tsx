interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = '';
  let textColor = 'text-white';

  switch (status.toLowerCase()) {
    case 'active':
      bgColor = 'bg-green-500';
      break;
    case 'retired':
      bgColor = 'bg-yellow-500 text-black';
      break;
    case 'out of service':
      bgColor = 'bg-red-500';
      break;
    case 'under maintenance':
      bgColor = 'bg-blue-500 ';
      break;
    default:
      bgColor = 'bg-gray-300';
      textColor = 'text-black';
  }

  return (
    <span className={`px-2 py-1 ${bgColor} ${textColor} rounded-full`}>
      {status}
    </span>
  );
};
