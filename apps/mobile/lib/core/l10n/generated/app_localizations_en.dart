// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appTitle => 'FridgeChef';

  @override
  String get home => 'Home';

  @override
  String get fridge => 'Fridge';

  @override
  String get addItems => 'Add';

  @override
  String get recipes => 'Recipes';

  @override
  String get settings => 'Settings';

  @override
  String get shopping => 'Shopping';

  @override
  String get shoppingList => 'Shopping';

  @override
  String greeting(String name) {
    return 'Hello 👋';
  }

  @override
  String get whatToCookToday => 'What to cook today?';

  @override
  String get whatToCook => 'What to cook?';

  @override
  String get addProducts => 'Add products';

  @override
  String get expiringItems => 'Expiring soon';

  @override
  String get recentAdditions => 'Recently added';

  @override
  String get noItems => 'No items yet';

  @override
  String get searchHint => 'Search products...';

  @override
  String get allCategories => 'All';

  @override
  String get meat => 'Meat';

  @override
  String get dairy => 'Dairy';

  @override
  String get vegetables => 'Vegetables';

  @override
  String get fruits => 'Fruits';

  @override
  String get grains => 'Grains';

  @override
  String get other => 'Other';

  @override
  String get bakery => 'Bakery';

  @override
  String get baking => 'Baking';

  @override
  String get seafood => 'Seafood';

  @override
  String get spices => 'Spices';

  @override
  String get beverages => 'Beverages';

  @override
  String get snacks => 'Snacks';

  @override
  String get oilsCondiments => 'Oils';

  @override
  String get photo => 'Photo';

  @override
  String get voice => 'Voice';

  @override
  String get text => 'Text';

  @override
  String get takePhoto => 'Take a photo';

  @override
  String get chooseFromGallery => 'Choose from gallery';

  @override
  String get startRecording => 'Tap to start recording';

  @override
  String get stopRecording => 'Tap to stop';

  @override
  String get textInputHint => 'Describe your groceries...';

  @override
  String get analyzing => 'Analyzing...';

  @override
  String get itemsDetected => 'Items detected';

  @override
  String get needsClarification => 'Needs clarification';

  @override
  String get confirm => 'Confirm';

  @override
  String get cancel => 'Cancel';

  @override
  String get confirmed => 'Confirmed!';

  @override
  String get cancelled => 'Cancelled';

  @override
  String get previewExpired => 'Preview expired. Please try again.';

  @override
  String get exactMatch => 'exact match';

  @override
  String get likelyMatch => 'likely match';

  @override
  String get approxMatch => 'approximate match';

  @override
  String combineUnit(String combined, String unit) {
    return 'Combine ($combined $unit)';
  }

  @override
  String get separateUnit => 'Separate';

  @override
  String currentlyInFridge(String qty, String unit) {
    return 'Currently: $qty $unit';
  }

  @override
  String get canCookNow => 'Can cook now';

  @override
  String get needToBuy => 'Need to buy';

  @override
  String get cookThis => 'Cook this';

  @override
  String get buyMissing => 'Buy missing';

  @override
  String missingItems(String items) {
    return 'Missing: $items';
  }

  @override
  String servings(int count) {
    return '$count servings';
  }

  @override
  String cookTime(int minutes) {
    return '$minutes min';
  }

  @override
  String get ingredients => 'Ingredients';

  @override
  String get steps => 'Steps';

  @override
  String get consumeIngredients => 'I cooked this!';

  @override
  String get consumed => 'Ingredients deducted from fridge';

  @override
  String get consumeTitle => 'What did you eat?';

  @override
  String get consumeHint => 'Describe what you consumed...';

  @override
  String get addToShoppingList => 'Add to shopping list';

  @override
  String get transferToFridge => 'Transfer to fridge';

  @override
  String get emptyShoppingList => 'Shopping list is empty';

  @override
  String get language => 'Language';

  @override
  String get ukrainian => 'Ukrainian';

  @override
  String get english => 'English';

  @override
  String get account => 'Account';

  @override
  String get signOut => 'Sign out';

  @override
  String get signOutConfirm => 'Are you sure you want to sign out?';

  @override
  String get yes => 'Yes';

  @override
  String get no => 'No';

  @override
  String get signIn => 'Sign in';

  @override
  String get signUp => 'Sign up';

  @override
  String get email => 'Email';

  @override
  String get password => 'Password';

  @override
  String get continueWithGoogle => 'Continue with Google';

  @override
  String get orDivider => 'or';

  @override
  String get noAccount => 'Don\'t have an account?';

  @override
  String get haveAccount => 'Already have an account?';

  @override
  String get onboardingTitle1 => 'Add Products';

  @override
  String get onboardingDesc1 =>
      'Take a photo, record voice, or type to add groceries to your fridge';

  @override
  String get onboardingTitle2 => 'Find Recipes';

  @override
  String get onboardingDesc2 =>
      'Get personalized recipe suggestions based on what\'s in your fridge';

  @override
  String get onboardingTitle3 => 'Cook & Track';

  @override
  String get onboardingDesc3 =>
      'Cook recipes and automatically track consumed ingredients';

  @override
  String get getStarted => 'Get started';

  @override
  String get next => 'Next';

  @override
  String get skip => 'Skip';

  @override
  String get error => 'Something went wrong';

  @override
  String get retry => 'Retry';

  @override
  String get loading => 'Loading...';

  @override
  String get emptyFridge => 'Your fridge is empty!';

  @override
  String get emptyFridgeDesc => 'Add some products to get started';

  @override
  String get pullToRefresh => 'Pull to refresh';

  @override
  String get deleteItem => 'Delete';

  @override
  String get deleteConfirm => 'Delete this item?';

  @override
  String get itemDeleted => 'Item deleted';

  @override
  String get quantityUpdated => 'Quantity updated';

  @override
  String get noRecipes => 'No recipes available';

  @override
  String get noRecipesDesc =>
      'Add products to your fridge to get recipe suggestions';

  @override
  String get breakfast => 'Breakfast';

  @override
  String get lunch => 'Lunch';

  @override
  String get dinner => 'Dinner';

  @override
  String get snack => 'Snack';

  @override
  String get dessert => 'Dessert';

  @override
  String get drink => 'Drink';

  @override
  String expiresIn(int days) {
    return 'Expires in $days days';
  }

  @override
  String get expired => 'Expired';

  @override
  String itemCount(int count) {
    return '$count items';
  }

  @override
  String get fridgeChef => 'FridgeChef';

  @override
  String get smartKitchen => 'Your smart kitchen companion';

  @override
  String get settingsGeneral => 'General';

  @override
  String get settingsPremium => 'Premium';

  @override
  String get premiumTitle => 'FridgeChef Premium';

  @override
  String get premiumSubtitle => 'Unlock all features';

  @override
  String get learnMore => 'Learn more';

  @override
  String get subscriptionTitle => 'FridgeChef Premium';

  @override
  String get subscriptionBenefit1 => 'Unlimited recipe suggestions';

  @override
  String get subscriptionBenefit2 => 'AI-powered meal planning';

  @override
  String get subscriptionBenefit3 => 'Advanced inventory tracking';

  @override
  String get subscriptionBenefit4 => 'Shopping list sync';

  @override
  String get subscriptionBenefit5 => 'Nutritional insights';

  @override
  String get subscriptionBenefit6 => 'Priority support';

  @override
  String get subscriptionBenefit7 => 'No ads';

  @override
  String get planMonthly => 'Monthly';

  @override
  String get planYearly => 'Yearly';

  @override
  String get planLifetime => 'Lifetime';

  @override
  String get planMonthlyPrice => '\$2.99/mo';

  @override
  String get planYearlyPrice => '\$19.90/yr';

  @override
  String get planLifetimePrice => '\$49.90';

  @override
  String get popular => 'POPULAR';

  @override
  String get savePercent => 'Save 45%';

  @override
  String get tryFree => 'Try free for 7 days';

  @override
  String get subscriptionDisclaimer =>
      'Cancel anytime. Payment will be charged at the end of the trial period.';
}
