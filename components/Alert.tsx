
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react-native';
import { Box } from './ui/box';
import { Text } from './ui/text';
import { Icon } from './ui/icon';

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle,
};

export const Alert = ({
  children,
  action = 'info',
  variant = 'subtle',
}: {
  children: React.ReactNode;
  action?: 'info' | 'warning' | 'success' | 'error';
  variant?: 'subtle' | 'solid';
}) => {
  const IconComponent = iconMap[action];

  return (
    <Box
     style={{ flexDirection:"row", alignItems:"center"}}
     className={`rounded-md px-3 py-2 ${
      variant === 'solid'
        ? action === 'info'
          ? 'bg-blue-600'
          : action === 'success'
          ? 'bg-green-600'
          : action === 'warning'
          ? 'bg-yellow-600'
          : 'bg-red-600'
        : 'bg-coolGray-100'
    }`}
    >
      <Icon as={IconComponent} className={`mr-2 ${variant === 'solid' ? 'text-white' : 'text-black'}`} />
      <Text className={`${variant === 'solid' ? 'text-white' : 'text-black'}`}>{children}</Text>
    </Box>
  );
};

export const AlertIcon = Icon;
export const AlertText = Text;