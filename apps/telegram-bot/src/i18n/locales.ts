export type Lang = 'ua' | 'en';

const strings: Record<Lang, Record<string, string>> = {
  ua: {
    // start
    welcome:
      '👋 <b>Ласкаво просимо до Fridge Assist!</b>\n\n' +
      'Я допомагаю відстежувати продукти у вашому холодильнику.\n\n' +
      'Щоб почати, поділіться номером телефону за допомогою кнопки нижче.',
    share_phone_button: '📱 Поділитися номером',

    // contact
    phone_saved:
      '✅ <b>Номер збережено!</b>\n\n' +
      'Все готово! Ось що я вмію:\n\n' +
      '📝 Надішліть текст, наприклад "купив 2 яблука"\n' +
      '📸 Надішліть фото продуктів\n' +
      '🎤 Надішліть голосове повідомлення\n' +
      '📋 Використовуйте /fridge щоб переглянути запаси',
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

    // help
    help_title: '📖 <b>Доступні команди:</b>\n',
    help_commands:
      '/start — Почати / перезапустити\n' +
      '/fridge — Переглянути запаси\n' +
      '/lang — Змінити мову\n' +
      '/help — Показати цю довідку',

    // language
    lang_prompt: '🌐 <b>Оберіть мову:</b>',
    lang_changed: '✅ Мову змінено на українську.',
  },

  en: {
    // start
    welcome:
      '👋 <b>Welcome to Fridge Assist!</b>\n\n' +
      'I help you track what\'s in your fridge.\n\n' +
      'To get started, please share your phone number using the button below.',
    share_phone_button: '📱 Share phone number',

    // contact
    phone_saved:
      '✅ <b>Phone number saved!</b>\n\n' +
      'You\'re all set! Here\'s what I can do:\n\n' +
      '📝 Send a text like "bought 2 apples"\n' +
      '📸 Send a photo of groceries\n' +
      '🎤 Send a voice message\n' +
      '📋 Use /fridge to see your inventory',
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

    // help
    help_title: '📖 <b>Available commands:</b>\n',
    help_commands:
      '/start — Start / restart\n' +
      '/fridge — Show inventory\n' +
      '/lang — Change language\n' +
      '/help — Show this help',

    // language
    lang_prompt: '🌐 <b>Choose your language:</b>',
    lang_changed: '✅ Language changed to English.',
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
