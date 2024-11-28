interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = '';
  let textColor = 'text-white';

  switch (status) {
    case 'Active':
      bgColor = 'bg-green-500';
      break;
    case 'Pending':
      bgColor = 'bg-yellow-500 text-black';
      break;
    case 'Terminated':
      bgColor = 'bg-red-500';
      break;
    case 'Inactive':
      bgColor = 'bg-red-500';
      break;
    case 'On Leave':
      bgColor = 'bg-yellow-500 text-black';
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
