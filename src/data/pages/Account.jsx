import { RiCoinLine, RiFileTextLine, RiHomeLine, RiMapPinLine, RiMoneyDollarCircleLine, RiNotificationLine } from 'react-icons/ri';

// Static base of the account sidebar. Items that need to be conditionally
// shown live in the `optional` list with a `flag` key — AccountSidebar reads
// the storefront settings (settings.activation.<flag>) to decide visibility.
export const sidebarMenu = [
  {
    title: 'Dashboard',
    icon: <RiHomeLine className='me-2'/>,
    id: 'dashboard',
    path: '/account/dashboard',
  },
  {
    title: 'Notifications',
    icon: <RiNotificationLine className='me-2'/>,
    id: 'notification',
    path: '/account/notification',
  },
  {
    title: 'EarningPoints',
    icon: <RiCoinLine className='me-2'/>,
    id: 'point',
    path: '/account/point',
    flag: 'earning_points',
  },
  {
    title: 'MyOrders',
    icon: <RiFileTextLine className='me-2'/>,
    id: 'order',
    path: '/account/order',
  },
  {
    title: 'RefundHistory',
    icon: <RiMoneyDollarCircleLine className='me-2'/>,
    id: 'refund',
    path: '/account/refund',
  },
  {
    title: 'SavedAddress',
    icon: <RiMapPinLine className='me-2'/>,
    id: 'address',
    path: '/account/addresses',
  },
];
