import { helpers, required, sameAs } from '@vuelidate/validators'

export const required$ = helpers.withMessage('Обязательное поле', required)
export const sameAs$ = (equalTo) =>
  helpers.withMessage('Пароли не свопадают', sameAs(equalTo))
