class ApiConstants {
  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://gwtkqhpgwmuqnjcikhze.supabase.co',
  );

  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3dGtxaHBnd211cW5qY2lraHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MzgwMTIsImV4cCI6MjA4NjIxNDAxMn0.k923jGRDiHQXaGGTyjSIHtwjN43ri4uX9c_kD9eMRKc',
  );

  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:3000/api',
  );

  static const Duration requestTimeout = Duration(seconds: 30);
}
