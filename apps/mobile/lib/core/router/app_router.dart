import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/providers/auth_provider.dart';
import '../../features/auth/presentation/screens/splash_screen.dart';
import '../../features/auth/presentation/screens/auth_screen.dart';
import '../../features/auth/presentation/screens/onboarding_screen.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/fridge/presentation/screens/fridge_screen.dart';
import '../../features/add_items/presentation/screens/add_items_screen.dart';
import '../../features/recipes/presentation/screens/recipes_screen.dart';
import '../../features/recipes/presentation/screens/recipe_detail_screen.dart';
import '../../features/consume/presentation/screens/consume_screen.dart';
import '../../features/shopping/presentation/screens/shopping_screen.dart';
import '../../features/settings/presentation/screens/settings_screen.dart';
import '../../features/settings/presentation/screens/subscription_screen.dart';
import '../../shared/widgets/app_scaffold.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: '/splash',
    redirect: (context, state) {
      final path = state.uri.path;

      if (path == '/splash') return null;

      return authState.when(
        initial: () => '/splash',
        loading: () => null,
        unauthenticated: () => path == '/auth' ? null : '/auth',
        needsOnboarding: (_) => path == '/onboarding' ? null : '/onboarding',
        authenticated: (_) {
          if (path == '/auth' || path == '/onboarding' || path == '/splash') {
            return '/';
          }
          return null;
        },
        error: (_) => path == '/auth' ? null : '/auth',
      );
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/auth',
        builder: (context, state) => const AuthScreen(),
      ),
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) => AppScaffold(child: child),
        routes: [
          GoRoute(
            path: '/',
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: '/fridge',
            builder: (context, state) => const FridgeScreen(),
          ),
          GoRoute(
            path: '/add',
            builder: (context, state) => const AddItemsScreen(),
          ),
          GoRoute(
            path: '/recipes',
            builder: (context, state) => const RecipesScreen(),
          ),
          GoRoute(
            path: '/recipe/:dishName',
            builder: (context, state) {
              final dishName = state.pathParameters['dishName']!;
              return RecipeDetailScreen(dishName: dishName);
            },
          ),
          GoRoute(
            path: '/consume',
            builder: (context, state) => const ConsumeScreen(),
          ),
          GoRoute(
            path: '/shopping',
            builder: (context, state) => const ShoppingScreen(),
          ),
          GoRoute(
            path: '/settings',
            builder: (context, state) => const SettingsScreen(),
          ),
          GoRoute(
            path: '/subscription',
            builder: (context, state) => const SubscriptionScreen(),
          ),
        ],
      ),
    ],
  );
});
