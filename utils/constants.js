const errorMessage = {
  userNotFoundMessage: 'Ошибка получения пользователя с некорректным id',
  userBadRequestMessage: 'Ошибка получения пользователя с несуществующим в Базе Данных id',
  cardBadRequestMessage: 'Ошибка получения карточки с несуществующим в Базе Данных id',
  validationErrorMessage: 'Пожалуйста, проверьте правильность введенных данных',
  cardNotFoundMessage: 'Ошибка получения карточки с некорректным id',
  unauthorizedErrorMessage: 'Что-то не так при аутентификации или авторизации',
  needAuthorizationMessage: 'Необходима авторизация',
  defaultNotFoundMessage: 'Страница не найдена',
  conflictingRequestMessage: 'Пользователь с таким Email уже существует',
  forbiddenMessage: 'Недостаточно прав для осуществелния данного действия',
  productNotFoundMessage: 'Ошибка получения продукта с некорректным id',
};

module.exports = errorMessage;
