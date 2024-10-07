import 'package:flutter/material.dart';
// To parse this JSON data, do
//
//     final clientes = clientesFromJson(jsonString);

import 'package:meta/meta.dart';
import 'dart:convert';

Clientes clientesFromJson(String str) => Clientes.fromJson(json.decode(str));

String clientesToJson(Clientes data) => json.encode(data.toJson());

class Clientes {
  final int usrId;
  final String userMail;
  final String password;
  final String name;
  final String lastName;
  final String country;
  final String province;
  final String district;
  final String canton;
  final String infoAdicional;

  Clientes({
    required this.usrId,
    required this.userMail,
    required this.password,
    required this.name,
    required this.lastName,
    required this.country,
    required this.province,
    required this.district,
    required this.canton,
    required this.infoAdicional,
  });
  //los nombres deben ser iguales que los que hay en la base de datos
  factory Clientes.fromJson(Map<String, dynamic> json) => Clientes(
        usrId: json["usrID"],
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
        "usrID": usrId,
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
