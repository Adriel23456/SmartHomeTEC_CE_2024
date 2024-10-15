import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:smart_home_tec_app/SQLite/sql_helper.dart';
import 'package:smart_home_tec_app/pages/created_objects/button.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';
import 'package:smart_home_tec_app/pages/created_objects/textentry.dart';
import 'package:smart_home_tec_app/pages/main_page.dart';
import 'package:smart_home_tec_app/pages/register_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  //definir controles, estos van a obtener el valor de entrada y enviarlo a la base de datos
  final email = TextEditingController();
  final password = TextEditingController();
  bool isRemembered = false;
  bool loginCorrect = false;
  final db = DatabaseHelper();
  Future<void> _deleteDatabases() async {
    await db.deleteAllDatabases(); // Call the method to delete all databases
    // Optionally, you could also initialize the databases again here if needed
  }

  login() async {
    //await _deleteDatabases();
    var result = await db
        .authenticate(Clientes(email: email.text, password: password.text));
    if (result == true) {
      if (!mounted) return;
      Clientes? clienteDetails = await db.getCliente(email.text);
      Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => UserPage(clienteData: clienteDetails)));
    } else {
      setState(() {
        loginCorrect = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: colorFondo,
        body: SafeArea(
            child: Center(
                child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              "Inicio de Sesión",
              style: TextStyle(
                  fontSize: 40,
                  fontWeight: FontWeight.bold,
                  color: colorBaseBoton),
            ),
            TextEntry(
                writtenText: "Correo",
                icon: Icons.account_circle,
                controller: email),
            TextEntry(
                writtenText: "Contraseña",
                icon: Icons.lock,
                controller: password,
                passwordVisibility: true),
            ListTile(
              horizontalTitleGap: 2,
              title: const Text("Remember me"),
              leading: Checkbox(
                  activeColor: colorBaseBoton,
                  value: isRemembered,
                  onChanged: (value) {
                    setState(() {
                      isRemembered = !isRemembered;
                    });
                  }),
            ),
            Button(
                texto: "Iniciar Sesión",
                funcion: () {
                  login();
                }),
            Row(
              children: [
                Text(
                  "No tienes una cuenta? ",
                  style: TextStyle(color: Colors.grey),
                ),
                TextButton(
                    onPressed: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => const RegisterPage()));
                    },
                    child: const Text("Registrate"))
              ],
            ),
            loginCorrect
                ? Text(
                    "El correo o contraseña están incorrectos",
                    style: TextStyle(
                      color: Colors.red.shade900,
                    ),
                  )
                : const SizedBox(),
          ],
        ))));
  }
}
