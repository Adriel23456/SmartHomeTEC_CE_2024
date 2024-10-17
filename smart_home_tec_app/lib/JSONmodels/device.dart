import 'dart:convert';

Device deviceFromJson(String str) => Device.fromJson(json.decode(str));

String deviceToJson(Device data) => json.encode(data.toJson());

class Device {
    final int serialNumber;
    final int price;
    final String state;
    final String brand;
    final int amountAvailable;
    final String electricalConsumption;
    final String name;
    final String description;
    final String deviceTypeName;
    final int legalNum;

    Device({
        required this.serialNumber,
        required this.price,
        required this.state,
        required this.brand,
        required this.amountAvailable,
        required this.electricalConsumption,
        required this.name,
        required this.description,
        required this.deviceTypeName,
        required this.legalNum,
    });

    factory Device.fromJson(Map<String, dynamic> json) => Device(
        serialNumber: json["serialNumber"],
        price: json["price"],
        state: json["state"],
        brand: json["brand"],
        amountAvailable: json["amountAvailable"],
        electricalConsumption: json["electricalConsumption"],
        name: json["name"],
        description: json["description"],
        deviceTypeName: json["deviceTypeName"],
        legalNum: json["legalNum"],
    );

    Map<String, dynamic> toJson() => {
        "serialNumber": serialNumber,
        "price": price,
        "state": state,
        "brand": brand,
        "amountAvailable": amountAvailable,
        "electricalConsumption": electricalConsumption,
        "name": name,
        "description": description,
        "deviceTypeName": deviceTypeName,
        "legalNum": legalNum,
    };
}
