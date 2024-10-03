import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';

class RegisterPage extends StatefulWidget{
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState()=> _RegisterPageState();

}

class _RegisterPageState extends State<RegisterPage> {
  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: colorFondo,
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text("Registrar la cuenta", style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold, color: colorBaseBoton),),
            ],
          )))
    );
  }
}