import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/pages/created_objects/button.dart';

class AuthPage extends StatelessWidget {
  const AuthPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SafeArea(
            child: Center(
      child: Column(
        children: [
          //here goes all the elements of the page/screen
          const Text(
            "Pagina de Autenticacion",
            style: TextStyle(fontSize: 35, fontWeight: FontWeight.bold),
            ),
          const Text(
            "Inicia sesión o Regista tu cuenta",
            style: TextStyle(color: Colors.grey),
            ),
          Button(
            texto: "Login", 
            funcion:(){}
            ),
          Button(
            texto: "Registrarse",
            funcion:(){}
            ),
          //image.asset("route of image"),
        ],
      ),
    )));
  }
}
