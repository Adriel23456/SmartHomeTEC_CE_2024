import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/pages/created_objects/button.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';

class GestionPage extends StatefulWidget {
  const GestionPage({super.key});

  @override
  State<GestionPage> createState() => _GestionPage();
}

//en esta vista se listaran todos los dispositvos del usuario
//en cada uno se podra seleccionar si se enciende o se apaga el dispositivo
class _GestionPage extends State<GestionPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: colorFondo,
        body: Center(
            child: SafeArea(
                child: SingleChildScrollView(
                    child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 20),
                        child: Column(
                          children: [
                            const Text(
                              "Mis Dispositivos",
                              style: TextStyle(
                                  fontSize: 40,
                                  fontWeight: FontWeight.bold,
                                  color: colorBaseBoton),
                            ),
                            Button(
                                texto: "Asociar un nuevo dispositivo",
                                funcion: () {})
                          ],
                        ))))));
  }
}
