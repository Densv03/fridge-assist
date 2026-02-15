String categoryEmoji(String? category) {
  if (category == null) return '🍽️';
  final lower = category.toLowerCase();
  if (lower.contains('meat') || lower.contains('poultry')) return '🥩';
  if (lower.contains('dairy') || lower.contains('egg')) return '🧀';
  if (lower.contains('vegetable')) return '🥬';
  if (lower.contains('fruit')) return '🍎';
  if (lower.contains('grain') || lower.contains('pasta')) return '🌾';
  if (lower.contains('bakery') || lower.contains('bread')) return '🍞';
  if (lower.contains('baking')) return '🧁';
  if (lower.contains('seafood') || lower.contains('fish')) return '🐟';
  if (lower.contains('spice') || lower.contains('herb')) return '🌿';
  if (lower.contains('beverage') || lower.contains('drink')) return '🥤';
  if (lower.contains('snack') || lower.contains('sweet')) return '🍪';
  if (lower.contains('oil') || lower.contains('condiment') || lower.contains('sauce')) return '🫒';
  if (lower.contains('frozen')) return '🧊';
  if (lower.contains('canned')) return '🥫';
  return '🍽️';
}
