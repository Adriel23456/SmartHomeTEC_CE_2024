import 'package:flutter/material.dart';

class AuthPage extends StatelessWidget {
  const AuthPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
        body: SafeArea(
            child: Center(
      child: Column(
        children: [
          //here goes all the elements of the page/screen
          Text(
            "Pagina de Autenticacion",
            style: TextStyle(fontSize: 35, fontWeight: FontWeight.bold),
          ),
          Text(
            "Inicia sesión o Regista tu cuenta",
            style: TextStyle(color: Colors.grey),
          )
          //image.asset("route of image"),
        ],
      ),
    )));
  }
}
