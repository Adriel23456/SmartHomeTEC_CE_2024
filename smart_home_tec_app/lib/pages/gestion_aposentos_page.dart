import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:smart_home_tec_app/SQLite/sql_helper.dart';
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
  List<String> chamberNames=[];
  final db = DatabaseHelper();

  @override
  void initState() {
    super.initState();
    _loadChambers();  // Load chambers on widget initialization
  }

  // Function to load chambers from the database
  Future<void> _loadChambers() async {
    if (widget.clienteData != null) {
      List<String> chambers = await db.getChambers(widget.clienteData!.email);
      setState(() {
        chamberNames = chambers;
      });
    }
  }

  Future<void> _deleteChamber(String chamberName) async {
    if (widget.clienteData != null) {
      //await db.deleteChamber(chamberName, widget.clienteData!.email);
      _loadChambers(); // Reload chambers after deletion
    }
  }



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
                    Navigator.push(context, MaterialPageRoute(builder: (context)=> RegisterAposento(clienteData: widget.clienteData))).then((_) => _loadChambers());
                  }
                ),
                const SizedBox(height: 20),
                ListView.builder(//lists all user chambers
                    shrinkWrap: true, // To avoid infinite height in the list
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: chamberNames.length,
                    itemBuilder: (context, index) {
                      return ListTile(
                        title: Text(chamberNames[index]),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () async {
                            await _deleteChamber(chamberNames[index]);
                          },
                        ),
                      );
                    },
                  ),
              ],)),)),)
    );
  }
}
