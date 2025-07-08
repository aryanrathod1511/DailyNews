export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  GENERAL: '/general',
  BUSINESS: '/business',
  TECHNOLOGY: '/technology',
  SPORTS: '/sports',
  ENTERTAINMENT: '/entertainment',
  HEALTH: '/health',
  SCIENCE: '/science',
  POLITICS: '/politics'
};

export const PROTECTED_ROUTES = [
  ROUTES.HOME,
  ROUTES.GENERAL,
  ROUTES.BUSINESS,
  ROUTES.TECHNOLOGY,
  ROUTES.SPORTS,
  ROUTES.ENTERTAINMENT,
  ROUTES.HEALTH,
  ROUTES.SCIENCE,
  ROUTES.POLITICS
];

export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER
]; 