import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:smart_home_tec_app/pages/created_objects/button.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';
import 'package:smart_home_tec_app/pages/gestion_aposentos_page.dart';
import 'package:smart_home_tec_app/pages/login_page.dart';

class UserPage extends StatelessWidget {
  final Clientes? clienteData;
  const UserPage({super.key, this.clienteData});

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
                  ListTile(
                    leading: Icon(Icons.person, size: 30),
                    title: Text("Nombre Completo: "),
                    subtitle: Text(
                      "${clienteData!.name ?? ""} ${clienteData!.middleName ?? ""} ${clienteData!.lastName ?? ""}",
                    ), //el "" se agrega por si la variable es null
                  ),
                  ListTile(
                    leading: Icon(Icons.mail, size: 30),
                    title: Text("Correo: "),
                    subtitle: Text(
                      clienteData!.email,
                    ),
                  ),
                  Button(texto: "Gestionar mis dispositivos", funcion: () {}),
                  Button(
                      texto: "Gestionar aposentos",
                      funcion: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => GestionAposentosPage(
                                      clienteData: clienteData,
                                    )));
                      }),
                  Button(
                      texto: "Salir",
                      funcion: () {
                        Navigator.pushAndRemoveUntil(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const LoginPage(),
                          ),
                          (Route<dynamic> route) => false,
                        ); //removes all previous widgets
                      }),
                ],
              ))),
    );
  }
}
