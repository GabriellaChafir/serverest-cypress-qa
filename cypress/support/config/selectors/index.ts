import { productRegistrationSelector } from './product-registration.selector';
import { userRegistrationSelector } from './user-registration.selector';
import { loginSelector } from './login.selector';

export const Selectors = {
  login: loginSelector,
  userRegistration: userRegistrationSelector,
  productRegistration: productRegistrationSelector,
} as const;

export default Selectors;
