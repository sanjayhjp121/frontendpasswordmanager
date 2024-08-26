import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const adminRoutes = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Brands',
    path: 'brand',
    icon: icon('box'),
  },
  {
    title: 'Subscriptions',
    path: 'subscription',
    icon: icon('ic_cart'),
  },
  {
    title: 'Vault',
    path: 'vault',
    icon: icon('ic_user'),
  },
  {
    title: 'Logs',
    path: '/logs',
    icon: icon('ic_lock'),
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: icon('ic_user'),
  },
];

const superAdminRoutes = [
  {
    title: 'dashboard',
    path: '/superadmin',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Payment Settings',
    path: '/superadmin/payment',
    icon: icon('ic_lock'),
  },
  // {
  //   title: 'Delete Password',
  //   path: '/superadmin/delete-password',
  //   icon: icon('ic_delete_password'),
  // },
  {
    title: 'Admins',
    path: '/superadmin/admins',
    icon: icon('ic_admin'),
  },
];

const userRoutes = [
  {
    title: 'Passwords',
    path: '/user',
    icon: icon('ic_lock')
  },
  {
    title: 'Profile',
    path: '/user/userprofile',
    icon: icon('ic_user'),
  },
  // {
  //   title: 'Media Account',
  //   path: '/user/media-account',
  //   icon: icon('ic_media')
  // }
];

const navConfig = (userRole) => {
  switch (userRole) {
    case 'superadmin':
      return superAdminRoutes;
    case 'user':
      return userRoutes;
    default:
      return adminRoutes;
  }
};

export default navConfig;
