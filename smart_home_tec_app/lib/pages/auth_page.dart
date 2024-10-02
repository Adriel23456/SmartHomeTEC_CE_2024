import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/pages/created_objects/button.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';
import 'package:smart_home_tec_app/pages/login_page.dart';
import 'package:smart_home_tec_app/pages/register_page.dart';

class AuthPage extends StatelessWidget {
  const AuthPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: colorFondo,
        body: SafeArea(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical:20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  //here goes all the elements of the page/screen
                  const Text("Pagina de Autenticacion", style: TextStyle(fontSize: 35, fontWeight: FontWeight.bold, color: colorBaseBoton),),
                  const Text("Inicia sesión o Regista tu cuenta", style: TextStyle(color: Colors.grey),),
                  Button(texto: "Login",funcion:(){Navigator.push(context,MaterialPageRoute(builder: (context)=>const LoginPage()));}),
                  Button(texto: "Registrarse", funcion:(){Navigator.push(context,MaterialPageRoute(builder: (context)=>const RegisterPage()));}),
                  //image.asset("route of image"), //add an image, do Expanded(child: Image...), for expanding the buttons way down
                ],
              ),
              ),
    )));
  }
}
