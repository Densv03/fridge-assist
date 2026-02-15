import 'package:freezed_annotation/freezed_annotation.dart';

part 'user.freezed.dart';
part 'user.g.dart';

@freezed
class User with _$User {
  const factory User({
    required String id,
    required String provider,
    @JsonKey(name: 'provider_user_id') required String providerUserId,
    String? name,
    String? email,
    @JsonKey(name: 'avatar_url') String? avatarUrl,
    String? phone,
    @JsonKey(name: 'preferred_language') String? preferredLanguage,
    Map<String, dynamic>? metadata,
    @JsonKey(name: 'created_at') required String createdAt,
    @JsonKey(name: 'updated_at') required String updatedAt,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}
