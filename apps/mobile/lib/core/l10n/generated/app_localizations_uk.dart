// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Ukrainian (`uk`).
class AppLocalizationsUk extends AppLocalizations {
  AppLocalizationsUk([String locale = 'uk']) : super(locale);

  @override
  String get appTitle => 'FridgeChef';

  @override
  String get home => 'Головна';

  @override
  String get fridge => 'Холодильник';

  @override
  String get addItems => 'Додати';

  @override
  String get recipes => 'Рецепти';

  @override
  String get settings => 'Налаштування';

  @override
  String get shopping => 'Покупки';

  @override
  String get shoppingList => 'Покупки';

  @override
  String greeting(String name) {
    return 'Привіт 👋';
  }

  @override
  String get whatToCookToday => 'Що приготувати сьогодні?';

  @override
  String get whatToCook => 'Що приготувати?';

  @override
  String get addProducts => 'Додати продукти';

  @override
  String get expiringItems => 'Скоро закінчується';

  @override
  String get recentAdditions => 'Нещодавно додані';

  @override
  String get noItems => 'Поки нічого';

  @override
  String get searchHint => 'Шукати продукти...';

  @override
  String get allCategories => 'Все';

  @override
  String get meat => 'М\'ясо';

  @override
  String get dairy => 'Молочне';

  @override
  String get vegetables => 'Овочі';

  @override
  String get fruits => 'Фрукти';

  @override
  String get grains => 'Крупи';

  @override
  String get other => 'Інше';

  @override
  String get bakery => 'Випічка';

  @override
  String get baking => 'Для випічки';

  @override
  String get seafood => 'Морепродукти';

  @override
  String get spices => 'Спеції';

  @override
  String get beverages => 'Напої';

  @override
  String get snacks => 'Солодощі';

  @override
  String get oilsCondiments => 'Олії';

  @override
  String get photo => 'Фото';

  @override
  String get voice => 'Голос';

  @override
  String get text => 'Текст';

  @override
  String get takePhoto => 'Зробити фото';

  @override
  String get chooseFromGallery => 'Обрати з галереї';

  @override
  String get startRecording => 'Натисніть для запису';

  @override
  String get stopRecording => 'Натисніть щоб зупинити';

  @override
  String get textInputHint => 'Опишіть ваші продукти...';

  @override
  String get analyzing => 'Аналізую...';

  @override
  String get itemsDetected => 'Знайдені продукти';

  @override
  String get needsClarification => 'Потрібне уточнення';

  @override
  String get confirm => 'Підтвердити';

  @override
  String get cancel => 'Скасувати';

  @override
  String get confirmed => 'Підтверджено!';

  @override
  String get cancelled => 'Скасовано';

  @override
  String get previewExpired =>
      'Попередній перегляд закінчився. Спробуйте ще раз.';

  @override
  String get exactMatch => 'точний збіг';

  @override
  String get likelyMatch => 'ймовірний збіг';

  @override
  String get approxMatch => 'приблизний збіг';

  @override
  String combineUnit(String combined, String unit) {
    return 'Об\'єднати ($combined $unit)';
  }

  @override
  String get separateUnit => 'Окремо';

  @override
  String currentlyInFridge(String qty, String unit) {
    return 'Зараз: $qty $unit';
  }

  @override
  String get canCookNow => 'Можна приготувати';

  @override
  String get needToBuy => 'Потрібно купити';

  @override
  String get cookThis => 'Приготувати';

  @override
  String get buyMissing => 'Купити';

  @override
  String missingItems(String items) {
    return 'Докупити: $items';
  }

  @override
  String servings(int count) {
    return '$count порцій';
  }

  @override
  String cookTime(int minutes) {
    return '$minutes хв';
  }

  @override
  String get ingredients => 'Інгредієнти';

  @override
  String get steps => 'Кроки';

  @override
  String get consumeIngredients => 'Приготовлено!';

  @override
  String get consumed => 'Інгредієнти списано з холодильника';

  @override
  String get consumeTitle => 'Що ви з\'їли?';

  @override
  String get consumeHint => 'Опишіть що ви споживали...';

  @override
  String get addToShoppingList => 'Додати до списку';

  @override
  String get transferToFridge => 'Перенести в холодильник';

  @override
  String get emptyShoppingList => 'Список покупок порожній';

  @override
  String get language => 'Мова';

  @override
  String get ukrainian => 'Українська';

  @override
  String get english => 'Англійська';

  @override
  String get account => 'Акаунт';

  @override
  String get signOut => 'Вийти';

  @override
  String get signOutConfirm => 'Ви впевнені, що хочете вийти?';

  @override
  String get yes => 'Так';

  @override
  String get no => 'Ні';

  @override
  String get signIn => 'Увійти';

  @override
  String get signUp => 'Зареєструватися';

  @override
  String get email => 'Електронна пошта';

  @override
  String get password => 'Пароль';

  @override
  String get continueWithGoogle => 'Продовжити з Google';

  @override
  String get orDivider => 'або';

  @override
  String get noAccount => 'Немає акаунту?';

  @override
  String get haveAccount => 'Вже є акаунт?';

  @override
  String get onboardingTitle1 => 'Додати продукти';

  @override
  String get onboardingDesc1 =>
      'Сфотографуйте, запишіть голос або введіть текст, щоб додати продукти';

  @override
  String get onboardingTitle2 => 'Знайти рецепти';

  @override
  String get onboardingDesc2 =>
      'Отримайте персоналізовані рецепти на основі вашого холодильника';

  @override
  String get onboardingTitle3 => 'Готуйте та відстежуйте';

  @override
  String get onboardingDesc3 =>
      'Готуйте страви та автоматично списуйте інгредієнти';

  @override
  String get getStarted => 'Почати';

  @override
  String get next => 'Далі';

  @override
  String get skip => 'Пропустити';

  @override
  String get error => 'Щось пішло не так';

  @override
  String get retry => 'Повторити';

  @override
  String get loading => 'Завантаження...';

  @override
  String get emptyFridge => 'Ваш холодильник порожній!';

  @override
  String get emptyFridgeDesc => 'Додайте продукти, щоб почати';

  @override
  String get pullToRefresh => 'Потягніть для оновлення';

  @override
  String get deleteItem => 'Видалити';

  @override
  String get deleteConfirm => 'Видалити цей продукт?';

  @override
  String get itemDeleted => 'Продукт видалено';

  @override
  String get quantityUpdated => 'Кількість оновлено';

  @override
  String get noRecipes => 'Рецепти недоступні';

  @override
  String get noRecipesDesc =>
      'Додайте продукти до холодильника, щоб отримати рецепти';

  @override
  String get breakfast => 'Сніданок';

  @override
  String get lunch => 'Обід';

  @override
  String get dinner => 'Вечеря';

  @override
  String get snack => 'Перекус';

  @override
  String get dessert => 'Десерт';

  @override
  String get drink => 'Напій';

  @override
  String expiresIn(int days) {
    return 'Закінчується через $days днів';
  }

  @override
  String get expired => 'Прострочено';

  @override
  String itemCount(int count) {
    return '$count продуктів';
  }

  @override
  String get fridgeChef => 'FridgeChef';

  @override
  String get smartKitchen => 'Ваш розумний кухонний помічник';

  @override
  String get settingsGeneral => 'Загальне';

  @override
  String get settingsPremium => 'Преміум';

  @override
  String get premiumTitle => 'FridgeChef Преміум';

  @override
  String get premiumSubtitle => 'Відкрийте всі можливості';

  @override
  String get learnMore => 'Дізнатися більше';

  @override
  String get subscriptionTitle => 'FridgeChef Преміум';

  @override
  String get subscriptionBenefit1 => 'Необмежені рецепти';

  @override
  String get subscriptionBenefit2 => 'AI планування їжі';

  @override
  String get subscriptionBenefit3 => 'Розширений облік продуктів';

  @override
  String get subscriptionBenefit4 => 'Синхронізація покупок';

  @override
  String get subscriptionBenefit5 => 'Дані про харчування';

  @override
  String get subscriptionBenefit6 => 'Пріоритетна підтримка';

  @override
  String get subscriptionBenefit7 => 'Без реклами';

  @override
  String get planMonthly => 'Місяць';

  @override
  String get planYearly => 'Рік';

  @override
  String get planLifetime => 'Назавжди';

  @override
  String get planMonthlyPrice => '79 грн/міс';

  @override
  String get planYearlyPrice => '529 грн/рік';

  @override
  String get planLifetimePrice => '1329 грн';

  @override
  String get popular => 'ПОПУЛЯРНИЙ';

  @override
  String get savePercent => 'Знижка 45%';

  @override
  String get tryFree => 'Спробувати 7 днів безкоштовно';

  @override
  String get subscriptionDisclaimer =>
      'Скасуйте будь-коли. Оплата буде знята після закінчення пробного періоду.';
}
