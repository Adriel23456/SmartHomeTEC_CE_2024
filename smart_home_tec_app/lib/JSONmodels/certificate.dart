import 'dart:convert';

Certificate certificateFromJson(String str) => Certificate.fromJson(json.decode(str));

String certificateToJson(Certificate data) => json.encode(data.toJson());

class Certificate {
  final int serialNumberDevice;
  final String brand;
  final String deviceTypeName;
  final String clientFullName;
  final String warrantyEndDate;
  final String warrantyStartDate;
  final int? billNum;
  final String clientEmail;

  Certificate({
    required this.serialNumberDevice,
    required this.brand,
    required this.deviceTypeName,
    required this.clientFullName,
    required this.warrantyEndDate,
    required this.warrantyStartDate,
    this.billNum,
    required this.clientEmail,
  });

  factory Certificate.fromJson(Map<String, dynamic> json) => Certificate(
        serialNumberDevice: json["serialNumberDevice"],
        brand: json["brand"],
        deviceTypeName: json["deviceTypeName"],
        clientFullName: json["clientFullName"],
        warrantyEndDate: json["warrantyEndDate"],
        warrantyStartDate: json["warrantyStartDate"],
        billNum: json["billNum"],
        clientEmail: json["clientEmail"],
      );

  Map<String, dynamic> toJson() => {
        "serialNumberDevice": serialNumberDevice,
        "brand": brand,
        "deviceTypeName": deviceTypeName,
        "clientFullName": clientFullName,
        "warrantyEndDate": warrantyEndDate,
        "warrantyStartDate": warrantyStartDate,
        "billNum": billNum,
        "clientEmail": clientEmail,
      };
}
