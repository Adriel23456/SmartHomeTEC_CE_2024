import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';

class TextEntry extends StatelessWidget {
  final String writtenText;
  final IconData icon;
  final TextEditingController controller;
  final bool passwordVisibility;
  const TextEntry({super.key, required this.writtenText, required this.icon, required this.controller, this.passwordVisibility=false});

  Widget build(BuildContext context){
    Size size = MediaQuery.of(context).size;
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 10),
      margin: EdgeInsets.symmetric(vertical: 6),
      width: size.width*.9,
      height: 55,
      decoration: BoxDecoration(
        color: colorFondo,
        borderRadius: BorderRadius.circular(8)
      ),
      child: TextFormField(
        obscureText: passwordVisibility,
        controller: controller,
        decoration: InputDecoration(
          border: InputBorder.none,
          hintText: writtenText,
          icon: Icon(icon),
        ),
      )
    );
  }


}