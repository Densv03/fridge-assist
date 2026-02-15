import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_uk.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'generated/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
      : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('uk')
  ];

  /// No description provided for @appTitle.
  ///
  /// In en, this message translates to:
  /// **'FridgeChef'**
  String get appTitle;

  /// No description provided for @home.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get home;

  /// No description provided for @fridge.
  ///
  /// In en, this message translates to:
  /// **'Fridge'**
  String get fridge;

  /// No description provided for @addItems.
  ///
  /// In en, this message translates to:
  /// **'Add'**
  String get addItems;

  /// No description provided for @recipes.
  ///
  /// In en, this message translates to:
  /// **'Recipes'**
  String get recipes;

  /// No description provided for @settings.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get settings;

  /// No description provided for @shopping.
  ///
  /// In en, this message translates to:
  /// **'Shopping'**
  String get shopping;

  /// No description provided for @shoppingList.
  ///
  /// In en, this message translates to:
  /// **'Shopping'**
  String get shoppingList;

  /// No description provided for @greeting.
  ///
  /// In en, this message translates to:
  /// **'Hello 👋'**
  String greeting(String name);

  /// No description provided for @whatToCookToday.
  ///
  /// In en, this message translates to:
  /// **'What to cook today?'**
  String get whatToCookToday;

  /// No description provided for @whatToCook.
  ///
  /// In en, this message translates to:
  /// **'What to cook?'**
  String get whatToCook;

  /// No description provided for @addProducts.
  ///
  /// In en, this message translates to:
  /// **'Add products'**
  String get addProducts;

  /// No description provided for @expiringItems.
  ///
  /// In en, this message translates to:
  /// **'Expiring soon'**
  String get expiringItems;

  /// No description provided for @recentAdditions.
  ///
  /// In en, this message translates to:
  /// **'Recently added'**
  String get recentAdditions;

  /// No description provided for @noItems.
  ///
  /// In en, this message translates to:
  /// **'No items yet'**
  String get noItems;

  /// No description provided for @searchHint.
  ///
  /// In en, this message translates to:
  /// **'Search products...'**
  String get searchHint;

  /// No description provided for @allCategories.
  ///
  /// In en, this message translates to:
  /// **'All'**
  String get allCategories;

  /// No description provided for @meat.
  ///
  /// In en, this message translates to:
  /// **'Meat'**
  String get meat;

  /// No description provided for @dairy.
  ///
  /// In en, this message translates to:
  /// **'Dairy'**
  String get dairy;

  /// No description provided for @vegetables.
  ///
  /// In en, this message translates to:
  /// **'Vegetables'**
  String get vegetables;

  /// No description provided for @fruits.
  ///
  /// In en, this message translates to:
  /// **'Fruits'**
  String get fruits;

  /// No description provided for @grains.
  ///
  /// In en, this message translates to:
  /// **'Grains'**
  String get grains;

  /// No description provided for @other.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get other;

  /// No description provided for @bakery.
  ///
  /// In en, this message translates to:
  /// **'Bakery'**
  String get bakery;

  /// No description provided for @baking.
  ///
  /// In en, this message translates to:
  /// **'Baking'**
  String get baking;

  /// No description provided for @seafood.
  ///
  /// In en, this message translates to:
  /// **'Seafood'**
  String get seafood;

  /// No description provided for @spices.
  ///
  /// In en, this message translates to:
  /// **'Spices'**
  String get spices;

  /// No description provided for @beverages.
  ///
  /// In en, this message translates to:
  /// **'Beverages'**
  String get beverages;

  /// No description provided for @snacks.
  ///
  /// In en, this message translates to:
  /// **'Snacks'**
  String get snacks;

  /// No description provided for @oilsCondiments.
  ///
  /// In en, this message translates to:
  /// **'Oils'**
  String get oilsCondiments;

  /// No description provided for @photo.
  ///
  /// In en, this message translates to:
  /// **'Photo'**
  String get photo;

  /// No description provided for @voice.
  ///
  /// In en, this message translates to:
  /// **'Voice'**
  String get voice;

  /// No description provided for @text.
  ///
  /// In en, this message translates to:
  /// **'Text'**
  String get text;

  /// No description provided for @takePhoto.
  ///
  /// In en, this message translates to:
  /// **'Take a photo'**
  String get takePhoto;

  /// No description provided for @chooseFromGallery.
  ///
  /// In en, this message translates to:
  /// **'Choose from gallery'**
  String get chooseFromGallery;

  /// No description provided for @startRecording.
  ///
  /// In en, this message translates to:
  /// **'Tap to start recording'**
  String get startRecording;

  /// No description provided for @stopRecording.
  ///
  /// In en, this message translates to:
  /// **'Tap to stop'**
  String get stopRecording;

  /// No description provided for @textInputHint.
  ///
  /// In en, this message translates to:
  /// **'Describe your groceries...'**
  String get textInputHint;

  /// No description provided for @analyzing.
  ///
  /// In en, this message translates to:
  /// **'Analyzing...'**
  String get analyzing;

  /// No description provided for @itemsDetected.
  ///
  /// In en, this message translates to:
  /// **'Items detected'**
  String get itemsDetected;

  /// No description provided for @needsClarification.
  ///
  /// In en, this message translates to:
  /// **'Needs clarification'**
  String get needsClarification;

  /// No description provided for @confirm.
  ///
  /// In en, this message translates to:
  /// **'Confirm'**
  String get confirm;

  /// No description provided for @cancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get cancel;

  /// No description provided for @confirmed.
  ///
  /// In en, this message translates to:
  /// **'Confirmed!'**
  String get confirmed;

  /// No description provided for @cancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get cancelled;

  /// No description provided for @previewExpired.
  ///
  /// In en, this message translates to:
  /// **'Preview expired. Please try again.'**
  String get previewExpired;

  /// No description provided for @exactMatch.
  ///
  /// In en, this message translates to:
  /// **'exact match'**
  String get exactMatch;

  /// No description provided for @likelyMatch.
  ///
  /// In en, this message translates to:
  /// **'likely match'**
  String get likelyMatch;

  /// No description provided for @approxMatch.
  ///
  /// In en, this message translates to:
  /// **'approximate match'**
  String get approxMatch;

  /// No description provided for @combineUnit.
  ///
  /// In en, this message translates to:
  /// **'Combine ({combined} {unit})'**
  String combineUnit(String combined, String unit);

  /// No description provided for @separateUnit.
  ///
  /// In en, this message translates to:
  /// **'Separate'**
  String get separateUnit;

  /// No description provided for @currentlyInFridge.
  ///
  /// In en, this message translates to:
  /// **'Currently: {qty} {unit}'**
  String currentlyInFridge(String qty, String unit);

  /// No description provided for @canCookNow.
  ///
  /// In en, this message translates to:
  /// **'Can cook now'**
  String get canCookNow;

  /// No description provided for @needToBuy.
  ///
  /// In en, this message translates to:
  /// **'Need to buy'**
  String get needToBuy;

  /// No description provided for @cookThis.
  ///
  /// In en, this message translates to:
  /// **'Cook this'**
  String get cookThis;

  /// No description provided for @buyMissing.
  ///
  /// In en, this message translates to:
  /// **'Buy missing'**
  String get buyMissing;

  /// No description provided for @missingItems.
  ///
  /// In en, this message translates to:
  /// **'Missing: {items}'**
  String missingItems(String items);

  /// No description provided for @servings.
  ///
  /// In en, this message translates to:
  /// **'{count} servings'**
  String servings(int count);

  /// No description provided for @cookTime.
  ///
  /// In en, this message translates to:
  /// **'{minutes} min'**
  String cookTime(int minutes);

  /// No description provided for @ingredients.
  ///
  /// In en, this message translates to:
  /// **'Ingredients'**
  String get ingredients;

  /// No description provided for @steps.
  ///
  /// In en, this message translates to:
  /// **'Steps'**
  String get steps;

  /// No description provided for @consumeIngredients.
  ///
  /// In en, this message translates to:
  /// **'I cooked this!'**
  String get consumeIngredients;

  /// No description provided for @consumed.
  ///
  /// In en, this message translates to:
  /// **'Ingredients deducted from fridge'**
  String get consumed;

  /// No description provided for @consumeTitle.
  ///
  /// In en, this message translates to:
  /// **'What did you eat?'**
  String get consumeTitle;

  /// No description provided for @consumeHint.
  ///
  /// In en, this message translates to:
  /// **'Describe what you consumed...'**
  String get consumeHint;

  /// No description provided for @addToShoppingList.
  ///
  /// In en, this message translates to:
  /// **'Add to shopping list'**
  String get addToShoppingList;

  /// No description provided for @transferToFridge.
  ///
  /// In en, this message translates to:
  /// **'Transfer to fridge'**
  String get transferToFridge;

  /// No description provided for @emptyShoppingList.
  ///
  /// In en, this message translates to:
  /// **'Shopping list is empty'**
  String get emptyShoppingList;

  /// No description provided for @language.
  ///
  /// In en, this message translates to:
  /// **'Language'**
  String get language;

  /// No description provided for @ukrainian.
  ///
  /// In en, this message translates to:
  /// **'Ukrainian'**
  String get ukrainian;

  /// No description provided for @english.
  ///
  /// In en, this message translates to:
  /// **'English'**
  String get english;

  /// No description provided for @account.
  ///
  /// In en, this message translates to:
  /// **'Account'**
  String get account;

  /// No description provided for @signOut.
  ///
  /// In en, this message translates to:
  /// **'Sign out'**
  String get signOut;

  /// No description provided for @signOutConfirm.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to sign out?'**
  String get signOutConfirm;

  /// No description provided for @yes.
  ///
  /// In en, this message translates to:
  /// **'Yes'**
  String get yes;

  /// No description provided for @no.
  ///
  /// In en, this message translates to:
  /// **'No'**
  String get no;

  /// No description provided for @signIn.
  ///
  /// In en, this message translates to:
  /// **'Sign in'**
  String get signIn;

  /// No description provided for @signUp.
  ///
  /// In en, this message translates to:
  /// **'Sign up'**
  String get signUp;

  /// No description provided for @email.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get email;

  /// No description provided for @password.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get password;

  /// No description provided for @continueWithGoogle.
  ///
  /// In en, this message translates to:
  /// **'Continue with Google'**
  String get continueWithGoogle;

  /// No description provided for @orDivider.
  ///
  /// In en, this message translates to:
  /// **'or'**
  String get orDivider;

  /// No description provided for @noAccount.
  ///
  /// In en, this message translates to:
  /// **'Don\'t have an account?'**
  String get noAccount;

  /// No description provided for @haveAccount.
  ///
  /// In en, this message translates to:
  /// **'Already have an account?'**
  String get haveAccount;

  /// No description provided for @onboardingTitle1.
  ///
  /// In en, this message translates to:
  /// **'Add Products'**
  String get onboardingTitle1;

  /// No description provided for @onboardingDesc1.
  ///
  /// In en, this message translates to:
  /// **'Take a photo, record voice, or type to add groceries to your fridge'**
  String get onboardingDesc1;

  /// No description provided for @onboardingTitle2.
  ///
  /// In en, this message translates to:
  /// **'Find Recipes'**
  String get onboardingTitle2;

  /// No description provided for @onboardingDesc2.
  ///
  /// In en, this message translates to:
  /// **'Get personalized recipe suggestions based on what\'s in your fridge'**
  String get onboardingDesc2;

  /// No description provided for @onboardingTitle3.
  ///
  /// In en, this message translates to:
  /// **'Cook & Track'**
  String get onboardingTitle3;

  /// No description provided for @onboardingDesc3.
  ///
  /// In en, this message translates to:
  /// **'Cook recipes and automatically track consumed ingredients'**
  String get onboardingDesc3;

  /// No description provided for @getStarted.
  ///
  /// In en, this message translates to:
  /// **'Get started'**
  String get getStarted;

  /// No description provided for @next.
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get next;

  /// No description provided for @skip.
  ///
  /// In en, this message translates to:
  /// **'Skip'**
  String get skip;

  /// No description provided for @error.
  ///
  /// In en, this message translates to:
  /// **'Something went wrong'**
  String get error;

  /// No description provided for @retry.
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get retry;

  /// No description provided for @loading.
  ///
  /// In en, this message translates to:
  /// **'Loading...'**
  String get loading;

  /// No description provided for @emptyFridge.
  ///
  /// In en, this message translates to:
  /// **'Your fridge is empty!'**
  String get emptyFridge;

  /// No description provided for @emptyFridgeDesc.
  ///
  /// In en, this message translates to:
  /// **'Add some products to get started'**
  String get emptyFridgeDesc;

  /// No description provided for @pullToRefresh.
  ///
  /// In en, this message translates to:
  /// **'Pull to refresh'**
  String get pullToRefresh;

  /// No description provided for @deleteItem.
  ///
  /// In en, this message translates to:
  /// **'Delete'**
  String get deleteItem;

  /// No description provided for @deleteConfirm.
  ///
  /// In en, this message translates to:
  /// **'Delete this item?'**
  String get deleteConfirm;

  /// No description provided for @itemDeleted.
  ///
  /// In en, this message translates to:
  /// **'Item deleted'**
  String get itemDeleted;

  /// No description provided for @quantityUpdated.
  ///
  /// In en, this message translates to:
  /// **'Quantity updated'**
  String get quantityUpdated;

  /// No description provided for @noRecipes.
  ///
  /// In en, this message translates to:
  /// **'No recipes available'**
  String get noRecipes;

  /// No description provided for @noRecipesDesc.
  ///
  /// In en, this message translates to:
  /// **'Add products to your fridge to get recipe suggestions'**
  String get noRecipesDesc;

  /// No description provided for @breakfast.
  ///
  /// In en, this message translates to:
  /// **'Breakfast'**
  String get breakfast;

  /// No description provided for @lunch.
  ///
  /// In en, this message translates to:
  /// **'Lunch'**
  String get lunch;

  /// No description provided for @dinner.
  ///
  /// In en, this message translates to:
  /// **'Dinner'**
  String get dinner;

  /// No description provided for @snack.
  ///
  /// In en, this message translates to:
  /// **'Snack'**
  String get snack;

  /// No description provided for @dessert.
  ///
  /// In en, this message translates to:
  /// **'Dessert'**
  String get dessert;

  /// No description provided for @drink.
  ///
  /// In en, this message translates to:
  /// **'Drink'**
  String get drink;

  /// No description provided for @expiresIn.
  ///
  /// In en, this message translates to:
  /// **'Expires in {days} days'**
  String expiresIn(int days);

  /// No description provided for @expired.
  ///
  /// In en, this message translates to:
  /// **'Expired'**
  String get expired;

  /// No description provided for @itemCount.
  ///
  /// In en, this message translates to:
  /// **'{count} items'**
  String itemCount(int count);

  /// No description provided for @fridgeChef.
  ///
  /// In en, this message translates to:
  /// **'FridgeChef'**
  String get fridgeChef;

  /// No description provided for @smartKitchen.
  ///
  /// In en, this message translates to:
  /// **'Your smart kitchen companion'**
  String get smartKitchen;

  /// No description provided for @settingsGeneral.
  ///
  /// In en, this message translates to:
  /// **'General'**
  String get settingsGeneral;

  /// No description provided for @settingsPremium.
  ///
  /// In en, this message translates to:
  /// **'Premium'**
  String get settingsPremium;

  /// No description provided for @premiumTitle.
  ///
  /// In en, this message translates to:
  /// **'FridgeChef Premium'**
  String get premiumTitle;

  /// No description provided for @premiumSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Unlock all features'**
  String get premiumSubtitle;

  /// No description provided for @learnMore.
  ///
  /// In en, this message translates to:
  /// **'Learn more'**
  String get learnMore;

  /// No description provided for @subscriptionTitle.
  ///
  /// In en, this message translates to:
  /// **'FridgeChef Premium'**
  String get subscriptionTitle;

  /// No description provided for @subscriptionBenefit1.
  ///
  /// In en, this message translates to:
  /// **'Unlimited recipe suggestions'**
  String get subscriptionBenefit1;

  /// No description provided for @subscriptionBenefit2.
  ///
  /// In en, this message translates to:
  /// **'AI-powered meal planning'**
  String get subscriptionBenefit2;

  /// No description provided for @subscriptionBenefit3.
  ///
  /// In en, this message translates to:
  /// **'Advanced inventory tracking'**
  String get subscriptionBenefit3;

  /// No description provided for @subscriptionBenefit4.
  ///
  /// In en, this message translates to:
  /// **'Shopping list sync'**
  String get subscriptionBenefit4;

  /// No description provided for @subscriptionBenefit5.
  ///
  /// In en, this message translates to:
  /// **'Nutritional insights'**
  String get subscriptionBenefit5;

  /// No description provided for @subscriptionBenefit6.
  ///
  /// In en, this message translates to:
  /// **'Priority support'**
  String get subscriptionBenefit6;

  /// No description provided for @subscriptionBenefit7.
  ///
  /// In en, this message translates to:
  /// **'No ads'**
  String get subscriptionBenefit7;

  /// No description provided for @planMonthly.
  ///
  /// In en, this message translates to:
  /// **'Monthly'**
  String get planMonthly;

  /// No description provided for @planYearly.
  ///
  /// In en, this message translates to:
  /// **'Yearly'**
  String get planYearly;

  /// No description provided for @planLifetime.
  ///
  /// In en, this message translates to:
  /// **'Lifetime'**
  String get planLifetime;

  /// No description provided for @planMonthlyPrice.
  ///
  /// In en, this message translates to:
  /// **'\$2.99/mo'**
  String get planMonthlyPrice;

  /// No description provided for @planYearlyPrice.
  ///
  /// In en, this message translates to:
  /// **'\$19.90/yr'**
  String get planYearlyPrice;

  /// No description provided for @planLifetimePrice.
  ///
  /// In en, this message translates to:
  /// **'\$49.90'**
  String get planLifetimePrice;

  /// No description provided for @popular.
  ///
  /// In en, this message translates to:
  /// **'POPULAR'**
  String get popular;

  /// No description provided for @savePercent.
  ///
  /// In en, this message translates to:
  /// **'Save 45%'**
  String get savePercent;

  /// No description provided for @tryFree.
  ///
  /// In en, this message translates to:
  /// **'Try free for 7 days'**
  String get tryFree;

  /// No description provided for @subscriptionDisclaimer.
  ///
  /// In en, this message translates to:
  /// **'Cancel anytime. Payment will be charged at the end of the trial period.'**
  String get subscriptionDisclaimer;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'uk'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'uk':
      return AppLocalizationsUk();
  }

  throw FlutterError(
      'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
      'an issue with the localizations generation tool. Please file an issue '
      'on GitHub with a reproducible sample app and the gen-l10n configuration '
      'that was used.');
}
