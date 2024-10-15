import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:smart_home_tec_app/pages/created_objects/button.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';
import 'package:smart_home_tec_app/pages/register_aposento.dart';

class GestionAposentosPage extends StatefulWidget {
  final Clientes? clienteData;
  const GestionAposentosPage({super.key, this.clienteData});

  @override
  State<GestionAposentosPage> createState() => _GestionAposentosState();
}

class _GestionAposentosState extends State<GestionAposentosPage> {
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: colorFondo,
      body:Center(
        child: SafeArea(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 20),
              child: Column(children: [
                const Text (
                  "Aposentos",
                  style: TextStyle(
                      fontSize: 40,
                      fontWeight: FontWeight.bold,
                      color: colorBaseBoton),
                ),
                Button(
                  texto: "Registrar un nuevo aposento",
                  funcion:(){
                    Navigator.push(context, MaterialPageRoute(builder: (context)=> RegisterAposento(clienteData: widget.clienteData)));
                  }
                ),
              ],)),)),)
    );
  }
}
