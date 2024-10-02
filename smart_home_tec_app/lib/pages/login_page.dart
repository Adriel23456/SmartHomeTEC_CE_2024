import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';

class LoginPage extends StatefulWidget{
  const LoginPage({super.key});

  @override
  State<LoginPage> createState()=> _LoginPageState();


}

class _LoginPageState extends State<LoginPage> {
  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: colorFondo,
      body: SafeArea(
        child:Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text("Inicio de Sesión", style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold, color: colorBaseBoton),),
            ],
          ))
      )
    );
  }
}