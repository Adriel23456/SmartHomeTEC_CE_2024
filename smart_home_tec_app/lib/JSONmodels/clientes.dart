import 'dart:convert';

Clientes clientesFromJson(String str) => Clientes.fromJson(json.decode(str));

String clientesToJson(Clientes data) => json.encode(data.toJson());

class Clientes {
  final String email;
  final String password;
  final String? region;
  final String? continent;
  final String? country;
  final String? name;
  final String? middleName;
  final String? lastName;

  Clientes({
    required this.email,
    required this.password,
    this.region,
    this.continent,
    this.country,
    this.name,
    this.middleName,
    this.lastName
  });
  //los nombres deben ser iguales que los que hay en la base de datos
  factory Clientes.fromJson(Map<String, dynamic> json) => Clientes(
        email: json["email"],
        password: json["password"],
        region: json["region"],
        continent: json["continent"],
        country: json["countrt"],
        name: json["name"],
        middleName: json["middleName"],
        lastName: json["lastName"],
      );

  Map<String, dynamic> toJson() => {
        "email": email,
        "password": password,
        "region": region,
        "continent": continent,
        "country": country,
        "name": name,
        "middleName": middleName,
        "lastName": lastName,
      };
}
