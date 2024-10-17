import 'dart:convert';

DeviceType deviceTypeFromJson(String str) => DeviceType.fromJson(json.decode(str));

String deviceTypeToJson(DeviceType data) => json.encode(data.toJson());

class DeviceType {
  final String name;
  final String? description;
  final int? warrantyDays;

  DeviceType({
    required this.name,
    this.description,
    this.warrantyDays,
  });

  factory DeviceType.fromJson(Map<String, dynamic> json) => DeviceType(
        name: json["name"],
        description: json["description"],
        warrantyDays: json["warrantyDays"],
      );

  Map<String, dynamic> toJson() => {
        "name": name,
        "description": description,
        "warrantyDays": warrantyDays,
      };
}
