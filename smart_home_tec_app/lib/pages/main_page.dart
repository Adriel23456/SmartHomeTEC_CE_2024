import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/pages/created_objects/button.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';
import 'package:smart_home_tec_app/pages/login_page.dart';

class UserPage extends StatefulWidget {
  const UserPage({super.key});

  @override
  State<UserPage> createState() => _UserPage();
}

class _UserPage extends State<UserPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: colorFondo,
      body: Center(
            child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircleAvatar(
                      radius: 57,
                      child: CircleAvatar(
                        radius: 55,
                        backgroundColor: colorBaseBoton,
                      ),
                    ),
                    Button(texto: "Salir", funcion: (){Navigator.push(context, MaterialPageRoute(builder: (context)=> const LoginPage()));}),

                  ],
                ))),
    );
  }
}
