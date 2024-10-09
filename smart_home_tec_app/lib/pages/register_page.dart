import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:smart_home_tec_app/SQLite/sql_helper.dart';
import 'package:smart_home_tec_app/pages/created_objects/button.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';
import 'package:smart_home_tec_app/pages/created_objects/textentry.dart';
import 'package:smart_home_tec_app/pages/login_page.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final userMail = TextEditingController();
  final password = TextEditingController();
  final name = TextEditingController();
  final lastName = TextEditingController();
  final passwordConfirm = TextEditingController();
  final country = TextEditingController();
  final province = TextEditingController();
  final district = TextEditingController();
  final canton = TextEditingController();
  final homeInfo = TextEditingController();
  final db = DatabaseHelper();

  bool fieldsFilled() {
    if (userMail.text.isNotEmpty &&
        password.text.isNotEmpty &&
        name.text.isNotEmpty &&
        lastName.text.isNotEmpty &&
        country.text.isNotEmpty &&
        province.text.isNotEmpty &&
        district.text.isNotEmpty &&
        canton.text.isNotEmpty &&
        homeInfo.text.isNotEmpty) {
      return true;
    } else {
      return false;
    }
  }

  register() async {
    if (fieldsFilled()) {
      //veridfy if all fields have text
      if (password.text == passwordConfirm.text) {
        //verify if both passwords are correct
        var result = await db.createCliente(Clientes(
            userMail: userMail.text,
            password: password.text,
            name: name.text,
            lastName: lastName.text,
            country: country.text,
            province: province.text,
            district: district.text,
            canton: canton.text,
            infoAdicional: homeInfo.text));

        if (result > 0) {
          if (!mounted) return;
          Navigator.push(context,
              MaterialPageRoute(builder: (context) => const LoginPage()));
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: colorFondo,
        body: SafeArea(
            child: Center(
                child: SingleChildScrollView(
                    child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 20),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              "Registrar la cuenta",
                              style: TextStyle(
                                  fontSize: 40,
                                  fontWeight: FontWeight.bold,
                                  color: colorBaseBoton),
                            ),
                            TextEntry(
                                writtenText: "Correo",
                                icon: Icons.mail,
                                controller: userMail),
                            TextEntry(
                                writtenText: "Nombre",
                                icon: Icons.account_circle,
                                controller: name),
                            TextEntry(
                                writtenText: "Apellidos",
                                icon: Icons.account_circle,
                                controller: lastName),
                            TextEntry(
                                writtenText: "Contraseña",
                                icon: Icons.lock,
                                controller: password,
                                passwordVisibility: true),
                            TextEntry(
                                writtenText: "Confirmar contraseña",
                                icon: Icons.lock,
                                controller: passwordConfirm,
                                passwordVisibility: true),
                            TextEntry(
                                writtenText: "Pais",
                                icon: Icons.add_location_alt_outlined,
                                controller: country),
                            TextEntry(
                                writtenText: "Provincia",
                                icon: Icons.add_location_alt_outlined,
                                controller: province),
                            TextEntry(
                                writtenText: "Districo",
                                icon: Icons.add_location_alt_outlined,
                                controller: district),
                            TextEntry(
                                writtenText: "Canton",
                                icon: Icons.add_location_alt_outlined,
                                controller: canton),
                            TextEntry(
                                writtenText: "Apartamento/Casa",
                                icon: Icons.add_location_alt_outlined,
                                controller: homeInfo),
                            Button(
                                texto: "Registrarse",
                                funcion: () {
                                  register();
                                }),
                            Row(
                              children: [
                                Text(
                                  "Ya tienes una cuenta? ",
                                  style: TextStyle(color: Colors.grey),
                                ),
                                TextButton(
                                    onPressed: () {
                                      Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                              builder: (context) =>
                                                  const LoginPage()));
                                    },
                                    child: const Text("Inicia Sesión"))
                              ],
                            ),
                          ],
                        ))))));
  }
}
