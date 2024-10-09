// To parse this JSON data, do
//
//     final clientes = clientesFromJson(jsonString);

import 'dart:convert';

Clientes clientesFromJson(String str) => Clientes.fromJson(json.decode(str));

String clientesToJson(Clientes data) => json.encode(data.toJson());

class Clientes {
  final String userMail;
  final String password;
  final String? name;
  final String? lastName;
  final String? country;
  final String? province;
  final String? district;
  final String? canton;
  final String? infoAdicional;

  Clientes({
    required this.userMail,
    required this.password,
    this.name,
    this.lastName,
    this.country,
    this.province,
    this.district,
    this.canton,
    this.infoAdicional,
  });
  //los nombres deben ser iguales que los que hay en la base de datos
  factory Clientes.fromJson(Map<String, dynamic> json) => Clientes(
        userMail: json["userMail"],
        password: json["password"],
        name: json["name"],
        lastName: json["lastName"],
        country: json["country"],
        province: json["province"],
        district: json["district"],
        canton: json["canton"],
        infoAdicional: json["infoAdicional"],
      );

  Map<String, dynamic> toJson() => {
        "userMail": userMail,
        "password": password,
        "name": name,
        "lastName": lastName,
        "country": country,
        "province": province,
        "district": district,
        "canton": canton,
        "infoAdicional": infoAdicional,
      };
}
