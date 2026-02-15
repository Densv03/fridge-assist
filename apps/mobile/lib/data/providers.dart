import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'api/api_client.dart';
import 'repositories/auth_repository.dart';
import 'repositories/inventory_repository.dart';
import 'repositories/ingestion_repository.dart';
import 'repositories/recipe_repository.dart';
import 'repositories/user_repository.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.watch(dioProvider));
});

final inventoryRepositoryProvider = Provider<InventoryRepository>((ref) {
  return InventoryRepository(ref.watch(dioProvider));
});

final ingestionRepositoryProvider = Provider<IngestionRepository>((ref) {
  return IngestionRepository(ref.watch(dioProvider));
});

final recipeRepositoryProvider = Provider<RecipeRepository>((ref) {
  return RecipeRepository(ref.watch(dioProvider));
});

final userRepositoryProvider = Provider<UserRepository>((ref) {
  return UserRepository(ref.watch(dioProvider));
});
