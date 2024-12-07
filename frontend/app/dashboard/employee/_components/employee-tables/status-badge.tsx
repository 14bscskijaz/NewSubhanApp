interface StatusBadgeProps {
    status: string;
  }
  
  export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    let bgColor = '';
    let textColor = 'text-white';
  
    switch (status?.toLowerCase()) {
      case 'active':
        bgColor = 'bg-green-500';
        break;
      case 'pending':
        bgColor = 'bg-yellow-500 text-black';
        break;
      case 'terminated':
        bgColor = 'bg-red-500';
        break;
      case 'inactive':
        bgColor = 'bg-red-500';
        break;
        case 'on leave':
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
  