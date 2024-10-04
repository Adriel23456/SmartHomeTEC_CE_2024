import 'package:flutter/material.dart';
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
                                controller: password,
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
                            Button(texto: "Registrarse", funcion: () {}),
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
