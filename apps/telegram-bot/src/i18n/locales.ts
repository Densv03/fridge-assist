export type Lang = 'ua' | 'en';

const strings: Record<Lang, Record<string, string>> = {
  ua: {
    // start
    welcome:
      '👋 <b>Ласкаво просимо до Fridge Assist!</b>\n\n' +
      'Я розумію текст, фото та голосові повідомлення.\nПросто напишіть мені, наприклад:\n\n' +
      '🛒 "Купив молоко, яйця і хліб"\n' +
      '🍳 "З\'їв 3 яйця"\n' +
      '🗑 "Викинув зіпсоване молоко"\n' +
      '📦 "Залишилось 5 яблук"\n' +
      '👨‍🍳 "Що приготувати?"\n' +
      '🧊 "Що в холодильнику?"\n\n' +
      'Або надішліть 📸 фото продуктів чи 🎤 голосове.\n\n' +
      'Щоб почати, поділіться номером телефону за допомогою кнопки нижче.' + 
      'Маєте ідею чи знайшли проблему? Просто скажіть або напишіть і ми дізнаємося про це\n',
    share_phone_button: '📱 Поділитися номером',

    // contact
    phone_saved:
      '✅ <b>Номер збережено!</b>\n\n' +
      'Все готово! Спробуйте надіслати мені:\n\n' +
      '"Купив 2 яблука і молоко"\n\n' +
      'Або надішліть 📸 фото чи 🎤 голосове повідомлення з продуктами.',
    phone_save_error: 'Не вдалося зберегти номер телефону. Спробуйте ще раз.',
    generic_error: 'Щось пішло не так. Спробуйте /start ще раз.',

    // fridge
    share_phone_prompt:
      'Будь ласка, спочатку поділіться номером телефону, щоб користуватися цією функцією.',
    fridge_empty:
      '🍽 <b>Ваш холодильник порожній!</b>\n\nНадішліть мені текст, фото або голосове повідомлення, щоб додати продукти.',
    fridge_title: '🧊 <b>Ваш холодильник</b>\n',
    fridge_total: 'Всього: {count} продукт(-ів)',
    fridge_error:
      'Не вдалося завантажити ваш холодильник. Спробуйте пізніше.',

    // text / ingestion
    no_items_found:
      '🤔 Не вдалося розпізнати продукти. Спробуйте описати їх інакше.',
    fridge_cleared: '🗑 <b>Холодильник очищено!</b>\nВидалено продуктів: {count}.',
    fridge_already_empty:
      '🍽 Ваш холодильник і так порожній!',
    processed_title: '✅ <b>Оброблено:</b>\n',
    clarification_title: '❓ <b>Потрібне уточнення:</b>\n',
    did_you_mean: 'Можливо, ви мали на увазі: {options}?',
    text_error: 'Не вдалося обробити ваше повідомлення. Спробуйте ще раз.',

    // photo
    photo_download_error:
      'Не вдалося завантажити фото. Спробуйте ще раз.',
    photo_error: 'Не вдалося обробити фото. Спробуйте ще раз.',

    // voice
    voice_download_error:
      'Не вдалося завантажити голосове повідомлення. Спробуйте ще раз.',
    voice_error:
      'Не вдалося обробити голосове повідомлення. Спробуйте ще раз.',

    // preview / confirmation
    preview_title_set: '🔄 <b>Оновити залишки:</b>',
    preview_title: '<b>Знайдено продукти:</b>',
    preview_clarification_note: '<b>Потребують уточнення:</b>',
    btn_confirm: '✅ Підтвердити',
    btn_cancel: '❌ Скасувати',
    btn_custom: '➕ Інше',
    preview_confirmed: '✅ <b>Підтверджено!</b>',
    preview_cancelled: '❌ Скасовано.',
    preview_expired: '⏰ Попередній перегляд закінчився. Надішліть повідомлення ще раз.',
    confirm_error: 'Не вдалося підтвердити. Спробуйте ще раз.',
    cancel_error: 'Не вдалося скасувати. Спробуйте ще раз.',
    custom_item_prompt: '✏️ Введіть назву для <b>{item}</b>:',
    custom_item_added: '✅ Додано: <b>{name}</b>',
    replace_item_prompt: '✏️ Введіть нову назву для <b>{item}</b>:',
    replace_item_done: '✅ Продукт замінено',
    change_amount_prompt: '🔢 Введіть нову кількість для <b>{item}</b> (напр. 500г, 2 кг, пів літра):',
    change_amount_done: '✅ Кількість змінено',
    change_amount_invalid: '❌ Не вдалося розпізнати кількість. Спробуйте ще раз, напр. 500г, 2 кг, пів літра',
    preview_confidence_legend: '🟢 точний збіг · 🟡 ймовірний збіг · 🟠 приблизний збіг',

    // unit conflict
    unit_conflict_label: '(зараз у холодильнику: {qty} {unit})',
    unit_conflict_combine_btn: '🤖 Об\'єднати (≈ {combined} {unit})',
    unit_conflict_separate_btn: '📋 Окремо',
    unit_conflict_combined_note: '(об\'єднано з {qty} {unit})',
    unit_conflict_separated_note: '(окремо)',

    // cook
    cook_can_cook_title: '👨‍🍳 <b>Можете приготувати зараз:</b>\n',
    cook_need_buy_title: '\n🛒 <b>Потрібно докупити:</b>\n',
    cook_missing: '🔸 Докупити: {items}',
    cook_empty_fridge:
      '🍽 <b>Ваш холодильник порожній!</b>\n\nДодайте продукти, щоб отримати рекомендації рецептів.',
    cook_error: 'Не вдалося отримати рецепти. Спробуйте пізніше.',
    cook_choose_dish: '\n👆 Натисніть на страву, щоб отримати повний рецепт.',
    cook_recipe_title: '📖 <b>{name}</b>',
    cook_servings: '👥 Порцій: {count}',
    cook_time: '⏱ Час: {minutes} хв',
    cook_ingredients_title: '\n🥘 <b>Інгредієнти:</b>',
    cook_steps_title: '\n📝 <b>Приготування:</b>',
    cook_recipe_expired: '⏰ Рекомендації застаріли. Використайте /cook ще раз.',
    cook_recipe_error: 'Не вдалося згенерувати рецепт. Спробуйте ще раз.',
    cook_back_button: '⬅️ Назад до списку',
    cook_cooked_button: '✅ Приготовлено!',
    cook_cooked_confirmed:
      '✅ <b>Приготовлено!</b> Інгредієнти списано з холодильника.',
    cook_consume_error:
      'Не вдалося оновити холодильник. Спробуйте ще раз.',
    cook_show_more_button: '🔄 Ще варіанти',
    cook_something_else_button: '✨ Щось інше',
    cook_no_more: '🤷 Більше варіантів не знайдено. Спробуйте додати продукти.',
    cook_prev_button: '⬅️ Назад',
    cook_pick_category: '🍽 <b>Оберіть тип страв:</b>',
    cook_cat_breakfast: 'Сніданок',
    cook_cat_lunch: 'Обід',
    cook_cat_dinner: 'Вечеря',
    cook_cat_snack: 'Перекус',
    cook_cat_dessert: 'Десерт',
    cook_cat_drink: 'Напій',
    cook_cat_select_all: '☑️ Обрати все',
    cook_cat_deselect_all: '☐ Зняти все',
    cook_cat_go: '🔍 Шукати',
    cook_cat_none_selected: 'Оберіть хоча б одну категорію!',
    cook_with_title: '🍳 <b>Рецепти з {ingredients}:</b>\n',

    // report
    report_saved: '✅ Дякуємо за {type}! Ми обов\'язково розглянемо.',
    report_type_bug: 'ваш звіт про помилку',
    report_type_idea: 'вашу пропозицію',
    report_error: 'Не вдалося зберегти звіт. Спробуйте ще раз.',

    // help
    help_title: '📖 <b>Що я вмію:</b>\n',
    help_commands:
      'Надішліть мені повідомлення, наприклад:\n\n' +
      '🛒 "Купив молоко, яйця і хліб"\n' +
      '🍳 "З\'їв 3 яйця"\n' +
      '🗑 "Викинув зіпсоване молоко"\n' +
      '📦 "Залишилось 5 яблук"\n' +
      '👨‍🍳 "Що приготувати?"\n' +
      '🧊 "Що в холодильнику?"\n\n' +
      'Також можна надіслати 📸 фото або 🎤 голосове.\n\n' +
      'Команди: /fridge · /cook · /lang',

    // language
    lang_prompt: '🌐 <b>Оберіть мову:</b>',
    lang_changed: '✅ Мову змінено на українську.',

    // update
    update_no_text: '⚠️ Використання: /update &lt;опис оновлення&gt;',
    update_started: '📤 Розсилка розпочата для {count} користувачів...',
    update_finished: '✅ Розсилку завершено!\n\nУспішно: {success}\nНе вдалося: {failed}',
  },

  en: {
    // start
    welcome:
      '👋 <b>Welcome to Fridge Assist!</b>\n\n' +
      'I understand text, photos, and voice messages.\nJust write to me, for example:\n\n' +
      '🛒 "Bought milk, eggs, and bread"\n' +
      '🍳 "Ate 3 eggs"\n' +
      '🗑 "Threw away spoiled milk"\n' +
      '📦 "5 apples left"\n' +
      '👨‍🍳 "What can I cook?"\n' +
      '🧊 "What\'s in my fridge?"\n\n' +
      'Or send a 📸 photo of groceries or a 🎤 voice message.\n\n' +
      'To get started, please share your phone number using the button below.\n\n' +
      'Have an idea or found a problem? Just say or write and we\'ll find out about it.',
    share_phone_button: '📱 Share phone number',

    // contact
    phone_saved:
      '✅ <b>Phone number saved!</b>\n\n' +
      'You\'re all set! Try sending me:\n\n' +
      '"Bought 2 apples and milk"\n\n' +
      'Or send a 📸 photo or 🎤 voice message with your groceries.',
    phone_save_error: 'Failed to save your phone number. Please try again.',
    generic_error: 'Something went wrong. Please try /start again.',

    // fridge
    share_phone_prompt:
      'Please share your phone number first to use this feature.',
    fridge_empty:
      '🍽 <b>Your fridge is empty!</b>\n\nSend me a text, photo, or voice message to add items.',
    fridge_title: '🧊 <b>Your Fridge</b>\n',
    fridge_total: 'Total: {count} item(s)',
    fridge_error: 'Failed to load your fridge. Please try again later.',

    // text / ingestion
    no_items_found:
      "🤔 I couldn't identify any items. Try describing them differently.",
    fridge_cleared: '🗑 <b>Fridge cleared!</b>\nRemoved {count} item(s).',
    fridge_already_empty:
      '🍽 Your fridge is already empty!',
    processed_title: '✅ <b>Processed:</b>\n',
    clarification_title: '❓ <b>Need clarification:</b>\n',
    did_you_mean: 'Did you mean: {options}?',
    text_error: 'Failed to process your message. Please try again.',

    // photo
    photo_download_error: 'Could not download the photo. Please try again.',
    photo_error: 'Failed to process the photo. Please try again.',

    // voice
    voice_download_error:
      'Could not download the voice message. Please try again.',
    voice_error: 'Failed to process the voice message. Please try again.',

    // preview / confirmation
    preview_title_set: '🔄 <b>Update remaining:</b>',
    preview_title: '<b>Items detected:</b>',
    preview_clarification_note: '<b>Need clarification:</b>',
    btn_confirm: '✅ Confirm',
    btn_cancel: '❌ Cancel',
    btn_custom: '➕ Custom',
    preview_confirmed: '✅ <b>Confirmed!</b>',
    preview_cancelled: '❌ Cancelled.',
    preview_expired: '⏰ Preview has expired. Please send your message again.',
    confirm_error: 'Failed to confirm. Please try again.',
    cancel_error: 'Failed to cancel. Please try again.',
    custom_item_prompt: '✏️ Enter a name for <b>{item}</b>:',
    custom_item_added: '✅ Added: <b>{name}</b>',
    replace_item_prompt: '✏️ Type a new name for <b>{item}</b>:',
    replace_item_done: '✅ Item replaced',
    change_amount_prompt: '🔢 Type a new amount for <b>{item}</b> (e.g. 500g, 2 kg, half a liter):',
    change_amount_done: '✅ Amount updated',
    change_amount_invalid: "❌ Couldn't recognize a quantity. Try again, e.g. 500g, 2 kg, half a liter",
    preview_confidence_legend: '🟢 exact match · 🟡 likely match · 🟠 approximate match',

    // unit conflict
    unit_conflict_label: '(currently in fridge: {qty} {unit})',
    unit_conflict_combine_btn: '🤖 Combine (≈ {combined} {unit})',
    unit_conflict_separate_btn: '📋 Separate',
    unit_conflict_combined_note: '(combined with {qty} {unit})',
    unit_conflict_separated_note: '(separate)',

    // cook
    cook_can_cook_title: '👨‍🍳 <b>You can cook right now:</b>\n',
    cook_need_buy_title: '\n🛒 <b>Need to buy a few things:</b>\n',
    cook_missing: '🔸 Buy: {items}',
    cook_empty_fridge:
      '🍽 <b>Your fridge is empty!</b>\n\nAdd some items to get recipe suggestions.',
    cook_error: 'Failed to get recipe suggestions. Please try again later.',
    cook_choose_dish: '\n👆 Tap a dish to get the full recipe.',
    cook_recipe_title: '📖 <b>{name}</b>',
    cook_servings: '👥 Servings: {count}',
    cook_time: '⏱ Time: {minutes} min',
    cook_ingredients_title: '\n🥘 <b>Ingredients:</b>',
    cook_steps_title: '\n📝 <b>Instructions:</b>',
    cook_recipe_expired: '⏰ Suggestions have expired. Use /cook again.',
    cook_recipe_error: 'Failed to generate recipe. Please try again.',
    cook_back_button: '⬅️ Back to list',
    cook_cooked_button: '✅ Cooked!',
    cook_cooked_confirmed:
      '✅ <b>Cooked!</b> Ingredients removed from fridge.',
    cook_consume_error:
      'Failed to update fridge. Please try again.',
    cook_show_more_button: '🔄 Show more',
    cook_something_else_button: '✨ Something else',
    cook_no_more: '🤷 No more suggestions found. Try adding items to your fridge.',
    cook_prev_button: '⬅️ Back',
    cook_pick_category: '🍽 <b>Pick meal categories:</b>',
    cook_cat_breakfast: 'Breakfast',
    cook_cat_lunch: 'Lunch',
    cook_cat_dinner: 'Dinner',
    cook_cat_snack: 'Snack',
    cook_cat_dessert: 'Dessert',
    cook_cat_drink: 'Drink',
    cook_cat_select_all: '☑️ Select all',
    cook_cat_deselect_all: '☐ Deselect all',
    cook_cat_go: '🔍 Search',
    cook_cat_none_selected: 'Please select at least one category!',
    cook_with_title: '🍳 <b>Recipes with {ingredients}:</b>\n',

    // report
    report_saved: '✅ Thank you for your {type}! We\'ll review it shortly.',
    report_type_bug: 'bug report',
    report_type_idea: 'idea',
    report_error: 'Failed to save the report. Please try again.',

    // help
    help_title: '📖 <b>What I can do:</b>\n',
    help_commands:
      'Send me a message like:\n\n' +
      '🛒 "Bought milk, eggs, and bread"\n' +
      '🍳 "Ate 3 eggs"\n' +
      '🗑 "Threw away spoiled milk"\n' +
      '📦 "5 apples left"\n' +
      '👨‍🍳 "What can I cook?"\n' +
      '🧊 "What\'s in my fridge?"\n\n' +
      'You can also send a 📸 photo or 🎤 voice message.\n\n' +
      'Commands: /fridge · /cook · /lang',

    // language
    lang_prompt: '🌐 <b>Choose your language:</b>',
    lang_changed: '✅ Language changed to English.',

    // update
    update_no_text: '⚠️ Usage: /update &lt;update description&gt;',
    update_started: '📤 Broadcast started for {count} users...',
    update_finished: '✅ Broadcast complete!\n\nSuccess: {success}\nFailed: {failed}',
  },
};

export function t(lang: Lang, key: string): string {
  return strings[lang]?.[key] ?? strings['en'][key] ?? key;
}

const UNIT_UA: Record<string, string> = {
  pcs: 'шт',
  grams: 'г',
  kg: 'кг',
  liters: 'л',
  ml: 'мл',
  cups: 'склянок',
  tbsp: 'ст.л.',
  tsp: 'ч.л.',
};

export function localizeUnit(unit: string, lang: Lang): string {
  if (lang === 'en') return unit;
  return UNIT_UA[unit.toLowerCase()] ?? unit;
}

const CATEGORY_UA: Record<string, string> = {
  'Bakery': 'Випічка',
  'Baking': 'Для випічки',
  'Dairy & Eggs': 'Молочне та яйця',
  'Fruits': 'Фрукти',
  'Grains & Pasta': 'Крупи та макарони',
  'Meat & Poultry': "М'ясо та птиця",
  'Oils & Condiments': 'Олії та соуси',
  'Seafood': 'Морепродукти',
  'Spices & Seasonings': 'Спеції та приправи',
  'Beverages': 'Напої',
  'Snacks & Sweets': 'Солодощі та снеки',
  'Vegetables': 'Овочі',
  'Other': 'Інше',
};

export function localizeCategory(category: string, lang: Lang): string {
  if (lang === 'en') return category;
  return CATEGORY_UA[category] ?? category;
}
