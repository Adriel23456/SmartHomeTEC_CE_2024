import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';

class Button extends StatelessWidget{
  final String texto;
  final VoidCallback funcion; //lo que va a llamar el boton al ser presionado
  const Button({super.key, required this.texto, required this.funcion});

  @override
  Widget build(BuildContext context){
    Size size = MediaQuery.of(context).size; //obtiene el tama;o del dispositivo
    return Container(
      margin: const EdgeInsets.symmetric(vertical:8),
      width:size.width *.9,
      height: 50,
      decoration: BoxDecoration(
        color: colorBaseBoton,
        borderRadius: BorderRadius.circular(8)
      ),
      child: TextButton(
        onPressed: funcion, 
        child: Text(texto, style: const TextStyle(color:Colors.white), ))
    );
  }
}
